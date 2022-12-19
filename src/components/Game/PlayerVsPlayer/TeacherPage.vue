<template>
  <div id="game" class="w-full min-h-screen pt-16" :style="backgroundImage">
    <GameUtilitiesJoin
      v-model="players"
      :game="game"
      :channel="channel"
      :state="state"
    />
    <GameUtilitiesJoinTeams
      v-if="state === GameState.pre"
      title="Zweikampf"
      :code="game.code"
      :teams="teams"
      @start="start"
    />

    <div v-if="state === GameState.run">
      <ScoreboardTeams
        :score-red="scoreRed"
        :score-blue="scoreBlue"
        class="w-full absolute top-16 left-0"
      >
        <DisplayBox
          color="gray"
          class="block w-full text-center font-bold resFontSizeExtraLarge text-center p-3 z-40"
          :shadow="false"
          :rounded="false"
        >
          <GameUtilitiesCountdown
            :minutes="game.config.time"
            class="z-40"
            @stop="stop"
          />
        </DisplayBox>
        <GameUtilitiesPuzzle
          v-if="timer > 1"
          :id="puzzle.id"
          class="rounded-t-3xl mt-5"
          :interactive="false"
          :question="puzzle.question"
          :answers="puzzle.answers"
          :solution="puzzle.solution"
        />
      </ScoreboardTeams>
      <div
        v-if="timer > 1"
        class="fixed bottom-5 w-full text-center animate__animated animate__fadeInDown animate__faster"
      >
        <DisplayBox color="purple" class="rounded-full inline-block px-7 py-2">
          <div class="inline-block">
            <span
              :id="teamRedRandomOrder[redPlayerIndex].id"
              class="resFontSizeLarge align-middle"
              >{{ teamRedRandomOrder[redPlayerIndex].name }}</span
            >
            <span class="resFontSizeExtraLarge align-middle mx-5">VS</span>
            <span
              :id="teamBlueRandomOrder[bluePlayerIndex].id"
              class="resFontSizeLarge align-middle"
              >{{ teamBlueRandomOrder[bluePlayerIndex].name }}</span
            >
          </div>
        </DisplayBox>
      </div>
    </div>

    <GameUtilitiesWinnerTeams
      v-if="state === GameState.end"
      :teams="teams"
      :score-red="scoreRed"
      :score-blue="scoreBlue"
    />
  </div>
</template>

<script lang="ts" setup>
import { shuffle } from "lodash";
import party from "party-js";
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  ref,
} from "vue";
import imageBackground from "../../../assets/img/player-vs-player/background.svg";
import Player from "../../../classes/Game/Player";
import PlayerVsPlayerGame from "../../../classes/Game/PlayerVsPlayerGame";
import Puzzle from "../../../classes/Game/Puzzle";
import PuzzleGenerator from "../../../classes/Game/PuzzleGenerator";
import TeamBuilder from "../../../classes/Game/TeamBuilder";
import GameState from "../../../classes/Utilities/GameState";
import PusherSubscription from "../../../classes/Utilities/PusherSubscription";
import DisplayBox from "../../Utilities/DisplayBox.vue";
import GameUtilitiesCountdown from "../Utilities/Countdown.vue";
import GameUtilitiesJoin from "../Utilities/Join.vue";
import GameUtilitiesJoinTeams from "../Utilities/JoinTeams.vue";
import GameUtilitiesPuzzle from "../Utilities/Puzzle.vue";
import ScoreboardTeams from "../Utilities/ScoreboardTeams.vue";
import GameUtilitiesWinnerTeams from "../Utilities/WinnerTeams.vue";

defineComponent({
  name: "GamePlayerVsPlayerTeacherPage",
});

const props = defineProps({
  game: {
    type: Object,
    default() {
      return {} as PlayerVsPlayerGame;
    },
  },
});

const channel = PusherSubscription(props.game.code);
const players = ref([] as Array<Player>);
const state = ref(GameState.pre);
const scoreRed = ref(0);
const scoreBlue = ref(0);
const puzzleGenerator = new PuzzleGenerator(props.game.expressions);
const puzzle = ref({} as Puzzle);
const teamRedRandomOrder = ref([] as Array<Player>);
const teamBlueRandomOrder = ref([] as Array<Player>);
const round = ref(0);
const timer = ref(0);
const interval = ref({} as NodeJS.Timeout);
const audioNewRound = new Audio("/snd/start.m4a");
const audioSuccess = new Audio("/snd/success.m4a");
const backgroundImage = { "background-image": "url(" + imageBackground + ")" };

const teams = computed(() => TeamBuilder.fifo(players.value));
const redPlayerIndex = computed(() => round.value % teams.value.red.length);
const bluePlayerIndex = computed(() => round.value % teams.value.blue.length);

onBeforeMount(() => {
  bindEvents();
});

onBeforeUnmount(() => {
  channel.unsubscribe();
  channel.disconnect();
  clearInterval(interval.value);
});

function bindEvents(): void {
  channel.bind(
    "client-puzzleSolved",
    (result: { playerId: string; correct: boolean; time: number }) => {
      score(result.playerId, result.correct, result.time);
    }
  );
}

function score(playerId: string, correct: boolean, time: number): void {
  if (correct) {
    celebrate(playerId);
    const points = 10 - Math.floor(time / 1000);
    players.value[
      players.value.findIndex((player) => player.id === playerId)
    ].score += points;
    const isTeamRed =
      teams.value.red.findIndex((player) => player.id === playerId) !== -1;
    if (isTeamRed) {
      scoreRed.value += points;
    } else {
      scoreBlue.value += points;
    }
  }
}

function celebrate(playerId: string): void {
  audioSuccess.play();
  party.confetti(document.getElementById(playerId) as HTMLElement, {
    count: party.variation.range(10, 30),
    spread: party.variation.range(1, 5),
    size: party.variation.range(0.5, 1.5),
  });
}

function newRound(): void {
  if (redPlayerIndex.value === 0) {
    teamRedRandomOrder.value = shuffle(teams.value.red);
  }
  if (bluePlayerIndex.value === 0) {
    teamBlueRandomOrder.value = shuffle(teams.value.blue);
  }
  puzzle.value = puzzleGenerator.generate();
  channel.trigger("client-puzzle", {
    playerIds: [
      teamRedRandomOrder.value[redPlayerIndex.value].id,
      teamBlueRandomOrder.value[bluePlayerIndex.value].id,
    ],
    puzzle: puzzle.value,
  });
  timer.value = 10;
  interval.value = setInterval(() => {
    timer.value--;
    if (timer.value <= 0) {
      clearInterval(interval.value);
      if (state.value === GameState.run) {
        round.value++;
        newRound();
        audioNewRound.play();
      }
    }
  }, 1000);
}

function start(): void {
  state.value = GameState.run;
  channel.trigger("client-start", {});
  newRound();
}

function stop(): void {
  state.value = GameState.end;
  let winner = "draw";
  if (scoreBlue.value < scoreRed.value) {
    winner = "red";
  } else if (scoreBlue.value > scoreRed.value) {
    winner = "blue";
  }
  channel.trigger("client-stop", {
    teams: teams.value,
    winner,
  });
}
</script>

<style scoped>
#game {
  background-color: #274687;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom;
}
</style>
