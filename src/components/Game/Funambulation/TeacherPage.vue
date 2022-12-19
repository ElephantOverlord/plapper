<template>
  <div id="game" class="w-full min-h-screen pt-16" :style="backgroundImage">
    <GameUtilitiesJoin
      v-model="players"
      :channel="channel"
      :game="game"
      :state="state"
    />
    <GameUtilitiesJoinTeams
      v-if="state === GameState.pre"
      :code="game.code"
      :teams="teams"
      title="Seiltanzen"
      @start="start"
    />

    <div
      v-if="state === GameState.run"
      class="animate__animated animate__fadeIn animate__faster"
    >
      <GameUtilitiesScoreboardTeams
        :score-red="scoreRed"
        :score-blue="scoreBlue"
        class="w-full absolute top-16 left-0"
      >
        <DisplayBox
          color="gray"
          class="block w-full text-center font-bold resFontSizeExtraLarge text-center p-3"
          :shadow="false"
          :rounded="false"
        >
          <GameUtilitiesCountdown :minutes="game.config.time" @stop="stop" />
        </DisplayBox>
      </GameUtilitiesScoreboardTeams>

      <GameFunambulationChicken
        :position="chickenPosition"
        @score="scoreTeam($event)"
      />
    </div>

    <GameUtilitiesWinnerTeams
      v-if="state === GameState.end"
      :teams="teams"
      :score-blue="scoreBlue"
      :score-red="scoreRed"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  ref,
} from "vue";
import imageBackground from "../../../assets/img/funambulation/background.svg";
import FunambulationGame from "../../../classes/Game/FunambulationGame";
import Player from "../../../classes/Game/Player";
import TeamBuilder from "../../../classes/Game/TeamBuilder";
import GameState from "../../../classes/Utilities/GameState";
import PusherSubscription from "../../../classes/Utilities/PusherSubscription";
import DisplayBox from "../../Utilities/DisplayBox.vue";
import GameUtilitiesCountdown from "../Utilities/Countdown.vue";
import GameUtilitiesJoin from "../Utilities/Join.vue";
import GameUtilitiesJoinTeams from "../Utilities/JoinTeams.vue";
import GameUtilitiesScoreboardTeams from "../Utilities/ScoreboardTeams.vue";
import GameUtilitiesWinnerTeams from "../Utilities/WinnerTeams.vue";
import GameFunambulationChicken from "./Chicken.vue";

defineComponent({
  name: "GameFunambulationTeacherPage",
});

const props = defineProps({
  game: {
    type: Object,
    default() {
      return {} as FunambulationGame;
    },
  },
});

const channel = PusherSubscription(props.game.code);
const players = ref([] as Array<Player>);
const state = ref(GameState.pre);
const chickenPosition = ref(0);
const scoreRed = ref(0);
const scoreBlue = ref(0);
const backgroundImage = { "background-image": "url(" + imageBackground + ")" };

const teams = computed(() => TeamBuilder.fifo(players.value));

onBeforeMount(() => {
  bindEvents();
});

onBeforeUnmount(() => {
  channel.unsubscribe();
  channel.disconnect();
});

function bindEvents(): void {
  channel.bind("client-score", (player: Player) => {
    if (state.value === GameState.run) {
      scorePlayer(player);
    }
  });
}

function start(): void {
  state.value = GameState.run;
  channel.trigger("client-start", {});
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

function scorePlayer(player: Player): void {
  const index = players.value.findIndex(
    (element: Player) => element.id === player.id
  );
  const isTeamRed =
    teams.value.blue.findIndex(
      (element: Player) => element.id === player.id
    ) === -1;
  players.value[index].score++;
  if (isTeamRed) {
    chickenPosition.value--;
  } else {
    chickenPosition.value++;
  }
}

function scoreTeam(team: string): void {
  if (team === "red") {
    scoreRed.value++;
  } else {
    scoreBlue.value++;
  }
  chickenPosition.value = 0;
}
</script>

<style scoped>
#game {
  background-color: #69df89;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom;
}
</style>
