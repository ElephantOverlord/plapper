<template>
  <div id="game" class="w-full min-h-screen pt-16" :style="backgroundImage">
    <GameUtilitiesWaitingStudent v-if="state === GameState.pre" />

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
import { defineComponent, onBeforeMount, onBeforeUnmount, ref } from "vue";
import imageBackground from "../../../assets/img/player-vs-player/background.svg";
import Player from "../../../classes/Game/Player";
import PlayerVsPlayerGame from "../../../classes/Game/PlayerVsPlayerGame";
import Puzzle from "../../../classes/Game/Puzzle";
import GameState from "../../../classes/Utilities/GameState";
import PusherSubscription from "../../../classes/Utilities/PusherSubscription";
import Store from "../../../classes/Utilities/Store";
import GameUtilitiesGameOverStudent from "../Utilities/GameOverStudent.vue";
import GameUtilitiesPuzzle from "../Utilities/Puzzle.vue";
import GameUtilitiesWaitingStudent from "../Utilities/WaitingStudent.vue";

defineComponent({
  name: "GamePlayerVsPlayerStudentPage",
});

const props = defineProps({
  game: {
    type: Object,
    default() {
      return {} as PlayerVsPlayerGame;
    },
  },
});

const player = Store.loadPlayerStudent();
const channel = PusherSubscription(props.game.code);
const state = ref(GameState.pre);
const puzzle = ref({} as Puzzle);
const puzzling = ref(false);
const puzzlingStart = ref(0);
const gameResult = ref("draw");
const backgroundImage = { "background-image": "url(" + imageBackground + ")" };

onBeforeMount(() => {
  bindStartEvent();
  bindStopEvent();
  bindPuzzleEvent();
});

onBeforeUnmount(() => {
  channel.trigger("client-leave", player);
  channel.unsubscribe();
  channel.disconnect();
});

function bindStartEvent(): void {
  channel.bind("client-start", () => {
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

function bindPuzzleEvent(): void {
  channel.bind(
    "client-puzzle",
    (result: { playerIds: Array<string>; puzzle: Puzzle }) => {
      if (result.playerIds.includes(player.id)) {
        puzzle.value = result.puzzle;
        puzzling.value = true;
        puzzlingStart.value = new Date().getTime();
        setTimeout(() => {
          puzzling.value = false;
        }, 9000);
      } else {
        puzzling.value = false;
      }
    }
  );
}

function solve(correct: boolean): void {
  channel.trigger("client-puzzleSolved", {
    playerId: player.id,
    correct,
    time: -(puzzlingStart.value - new Date().getTime()),
    puzzleId: puzzle.value.id,
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
