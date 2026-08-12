<template>
  <div id="game" class="w-full min-h-screen pt-16" :style="backgroundImage">
    <GameUtilitiesJoin
      v-model="players"
      :game="game"
      :channel="channel"
      :state="state"
      @player-removed="playerRemoved"
    />
    <GameUtilitiesJoinTeams
      v-if="state === GameState.pre"
      title="Staffellauf"
      :code="game.code"
      :teams="teams"
      @start="start"
    />

    <div v-if="state === GameState.run">
      <ScoreboardTeams
        :score-red="scoreRed"
        :score-blue="scoreBlue"
        class="w-full absolute top-16 left-0 z-10"
      >
        <DisplayBox
          color="gray"
          class="block w-full text-center resFontSizeNormal font-bold text-center p-3 z-40"
          :shadow="false"
          :rounded="false"
        >
          <div class="grid grid-cols-2">
            <div class="text-left">{{ redPlayer.name }}</div>
            <div class="text-right">
              {{ bluePlayer.name }}
            </div>
          </div>
        </DisplayBox>
      </ScoreboardTeams>
      <div class="absolute bottom-0 w-full">
        <img
          id="teamRed"
          src="../../../assets/img/relay/car_red.svg"
          alt="Team Red"
          class="z-10"
        />
        <img
          id="teamBlue"
          src="../../../assets/img/relay/car_blue.svg"
          alt="Team Blue"
          class="z-10"
        />
        <div
          id="finish"
          class="absolute left-1/2 bottom-0 h-screen w-10 -ml-5 z-0 opacity-80 shadow-lg border-l border-r border-black"
          :style="finishBackgroundImage"
        ></div>
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
import anime from "animejs";
import party from "party-js";
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  ref,
  watch,
} from "vue";
import imageBackground from "../../../assets/img/relay/background.svg";
import finishImageBackground from "../../../assets/img/relay/finish.png";
import Player from "../../../classes/Game/Player";
import Puzzle from "../../../classes/Game/Puzzle";
import PuzzleGenerator from "../../../classes/Game/PuzzleGenerator";
import RelayGame from "../../../classes/Game/RelayGame";
import TeamBuilder from "../../../classes/Game/TeamBuilder";
import GameState from "../../../classes/Utilities/GameState";
import { confetti } from "../../../classes/Utilities/Effects";
import PusherSubscription from "../../../classes/Utilities/PusherSubscription";
import DisplayBox from "../../Utilities/DisplayBox.vue";
import GameUtilitiesJoin from "../Utilities/Join.vue";
import GameUtilitiesJoinTeams from "../Utilities/JoinTeams.vue";
import ScoreboardTeams from "../Utilities/ScoreboardTeams.vue";
import GameUtilitiesWinnerTeams from "../Utilities/WinnerTeams.vue";

defineComponent({
  name: "GameRelayTeacherPage",
});

const props = defineProps({
  game: {
    type: Object,
    default() {
      return {} as RelayGame;
    },
  },
});

const channel = PusherSubscription(props.game.code);
const players = ref([] as Array<Player>);
const numRounds = 30;
const state = ref(GameState.pre);
const scoreRed = ref(0);
const scoreBlue = ref(0);
const roundRed = ref(0);
const roundBlue = ref(0);
const puzzleGenerator = new PuzzleGenerator(props.game.expressions);
const puzzles = ref([] as Array<Puzzle>);
const audioSuccess = new Audio("/snd/success.m4a");
const backgroundImage = { "background-image": "url(" + imageBackground + ")" };
const finishBackgroundImage = {
  "background-image": "url(" + finishImageBackground + ")",
};
const activePlayerIds = { red: "", blue: "" };
const activeTurnIds = { red: 0, blue: 0 };
const resolvedTurnIds = { red: 0, blue: 0 };
const penaltyTimeouts = {
  red: undefined as NodeJS.Timeout | undefined,
  blue: undefined as NodeJS.Timeout | undefined,
};

const teams = computed(() => TeamBuilder.fifo(players.value));
const redPlayer = computed(
  () =>
    teams.value.red.length
      ? teams.value.red[roundRed.value % teams.value.red.length]
      : ({} as Player)
);
const bluePlayer = computed(
  () =>
    teams.value.blue.length
      ? teams.value.blue[roundBlue.value % teams.value.blue.length]
      : ({} as Player)
);
const gameOver = computed(
  () => scoreRed.value >= numRounds || scoreBlue.value >= numRounds
);

onBeforeMount(() => {
  bindEvents();
  generatePuzzles();
});

onBeforeUnmount(() => {
  channel.unsubscribe();
  channel.disconnect();
  clearTimeout(penaltyTimeouts.red);
  clearTimeout(penaltyTimeouts.blue);
});

watch(
  () => scoreRed.value,
  () => {
    const vwSteps = (36 / numRounds) * scoreRed.value;
    anime({
      targets: "#teamRed",
      translateX: vwSteps + "vw",
      duration: 500,
    });
  }
);

watch(
  () => scoreBlue.value,
  () => {
    const vwSteps = (36 / numRounds) * scoreBlue.value;
    anime({
      targets: "#teamBlue",
      translateX: -vwSteps + "vw",
      duration: 500,
    });
  }
);

function bindEvents(): void {
  channel.bind(
    "client-puzzleSolved",
    (result: { playerId: string; correct: boolean; turnId: number }) => {
      if (state.value === GameState.run) {
        score(result.playerId, result.correct, result.turnId);
      }
    }
  );
}

function generatePuzzles(): void {
  for (let i = 0; i < numRounds; i++) {
    puzzles.value.push(puzzleGenerator.generate());
  }
}

function score(playerId: string, correct: boolean, turnId: number): void {
  const teamRed = activePlayerIds.red === playerId;
  const teamBlue = activePlayerIds.blue === playerId;
  if ((!teamRed && !teamBlue) || !Number.isInteger(turnId)) return;

  const team = teamRed ? "red" : "blue";
  if (activeTurnIds[team] !== turnId || resolvedTurnIds[team] === turnId) {
    return;
  }
  resolvedTurnIds[team] = turnId;

  if (correct) {
    const player = players.value.find((element) => element.id === playerId);
    if (!player) return;
    player.score++;
    if (teamRed) {
      scoreRed.value++;
      celebrate(true);
    } else {
      scoreBlue.value++;
      celebrate(false);
    }
    if (gameOver.value) {
      stop();
    } else {
      nextPlayer(teamRed);
    }
  } else {
      sulk(teamRed);
  }
}

function celebrate(teamRed: boolean): void {
  audioSuccess.play();
  confetti(
    document.getElementById(teamRed ? "teamRed" : "teamBlue") as HTMLElement,
    {
      count: party.variation.range(10, 30),
      spread: party.variation.range(1, 5),
      size: party.variation.range(0.5, 1.5),
    }
  );
}

function sulk(teamRed: boolean): void {
  anime({
    targets: teamRed ? "#teamRed" : "#teamBlue",
    filter: "grayscale(1)",
  });
  const team = teamRed ? "red" : "blue";
  clearTimeout(penaltyTimeouts[team]);
  penaltyTimeouts[team] = setTimeout(() => {
    anime({
      targets: teamRed ? "#teamRed" : "#teamBlue",
      filter: "grayscale(0)",
    });
    nextPlayer(teamRed);
  }, props.game.config.penalty * 1000);
}

function nextPlayer(teamRed: boolean): void {
  if (state.value !== GameState.run) return;
  if (!teams.value.red.length || !teams.value.blue.length) {
    stop();
    return;
  }
  const team = teamRed ? "red" : "blue";
  clearTimeout(penaltyTimeouts[team]);
  penaltyTimeouts[team] = undefined;
  teamRed ? roundRed.value++ : roundBlue.value++;
  const nextPlayer = teamRed ? redPlayer.value : bluePlayer.value;
  activeTurnIds[team]++;
  resolvedTurnIds[team] = 0;
  activePlayerIds[team] = nextPlayer.id;
  channel.trigger("client-nextPlayer", {
    player: nextPlayer,
    score: teamRed ? scoreRed.value : scoreBlue.value,
    turnId: activeTurnIds[team],
  });
}

function playerRemoved(playerId: string): void {
  if (state.value !== GameState.run) return;
  if (players.value.length < 2) {
    stop();
    return;
  }
  if (activePlayerIds.red === playerId) nextPlayer(true);
  if (activePlayerIds.blue === playerId) nextPlayer(false);
}

function start(): void {
  state.value = GameState.run;
  channel.trigger("client-start", { puzzles: puzzles.value });
  nextPlayer(true);
  nextPlayer(false);
}

function stop(): void {
  if (state.value === GameState.end) return;
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
  background-color: #e5a029;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom;
}

#teamRed {
  width: 10vw;
  height: auto;
  position: absolute;
  left: 5vw;
  bottom: 5vh;
}

#teamBlue {
  width: 10vw;
  height: auto;
  position: absolute;
  right: 5vw;
  bottom: 5vh;
}
</style>
