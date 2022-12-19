<template>
  <div id="game" class="w-full min-h-screen pt-16" :style="backgroundImage">
    <GameUtilitiesWaitingStudent v-if="state === GameState.pre" />

    <GameUtilitiesWaitingStudent
      v-if="state === GameState.run && !puzzling"
      message="Du bist bald an der Reihe!"
    />

    <GameUtilitiesPuzzle
      v-if="state === GameState.run && puzzling"
      :id="puzzle.id"
      :question="puzzle.question"
      :answers="puzzle.answers"
      :solution="puzzle.solution"
      @solved="solve($event)"
    />

    <GameUtilitiesGameOverStudent
      v-if="state === GameState.end"
      :result="gameResult"
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
import imageBackground from "../../../assets/img/relay/background.svg";
import Player from "../../../classes/Game/Player";
import Puzzle from "../../../classes/Game/Puzzle";
import RelayGame from "../../../classes/Game/RelayGame";
import GameState from "../../../classes/Utilities/GameState";
import PusherSubscription from "../../../classes/Utilities/PusherSubscription";
import Store from "../../../classes/Utilities/Store";
import GameUtilitiesGameOverStudent from "../Utilities/GameOverStudent.vue";
import GameUtilitiesPuzzle from "../Utilities/Puzzle.vue";
import GameUtilitiesWaitingStudent from "../Utilities/WaitingStudent.vue";

defineComponent({
  name: "GameRelayStudentPage",
});

const props = defineProps({
  game: {
    type: Object,
    default() {
      return {} as RelayGame;
    },
  },
});

const player = Store.loadPlayerStudent();
const channel = PusherSubscription(props.game.code);
const state = ref(GameState.pre);
const puzzles = ref([] as Array<Puzzle>);
const puzzling = ref(false);
const score = ref(0);
const timeout = ref({} as NodeJS.Timeout);
const gameResult = ref("draw");
const backgroundImage = { "background-image": "url(" + imageBackground + ")" };

const puzzle = computed(() => puzzles.value[score.value]);

onBeforeMount(() => {
  bindStartEvent();
  bindStopEvent();
  bindNextPlayerEvent();
});

onBeforeUnmount(() => {
  channel.trigger("client-leave", player);
  channel.unsubscribe();
  channel.disconnect();
});

function bindStartEvent(): void {
  channel.bind("client-start", (result: { puzzles: Array<Puzzle> }) => {
    puzzles.value = result.puzzles;
    state.value = GameState.run;
  });
}

function bindStopEvent(): void {
  channel.bind(
    "client-stop",
    (result: {
      teams: { red: Array<Player>; blue: Array<Player> };
      winner: string;
    }) => {
      state.value = GameState.end;
      const team =
        result.teams.red.findIndex((element) => element.id === player.id) === -1
          ? "blue"
          : "red";
      const winner = result.winner;
      if (winner !== "draw") {
        gameResult.value = winner === team ? "win" : "loss";
      }
    }
  );
}

function bindNextPlayerEvent(): void {
  channel.bind(
    "client-nextPlayer",
    (result: { player: Player; score: number }) => {
      if (result.player.id === player.id) {
        clearTimeout(timeout.value);
        score.value = result.score;
        puzzling.value = true;
        timeout.value = setTimeout(() => {
          solve(false);
        }, 9500);
      }
    }
  );
}

function solve(correct: boolean): void {
  clearTimeout(timeout.value);
  puzzling.value = false;
  channel.trigger("client-puzzleSolved", {
    playerId: player.id,
    correct,
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
