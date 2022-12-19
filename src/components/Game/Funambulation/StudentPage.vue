<template>
  <div
    id="game"
    class="w-full min-h-screen pt-16 relative"
    :style="backgroundImage"
  >
    <GameUtilitiesWaitingStudent v-if="state === GameState.pre" />

    <GameUtilitiesPuzzle
      v-if="state === GameState.run"
      :id="puzzle.id"
      :question="puzzle.question"
      :solution="puzzle.solution"
      :answers="puzzle.answers"
      @solved="solve($event)"
    >
      <div
        v-if="wrongAnswerStreak >= 2"
        class="mt-5 resFontSizeNormal text-red-700 animate__animated animate__zoomIn"
      >
        <b>Zehn Sekunden Strafe:</b><br />Zwei falsche Antworten nacheinander.
      </div>
    </GameUtilitiesPuzzle>

    <GameOverStudent v-if="state === GameState.end" :result="gameResult" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onBeforeMount, onBeforeUnmount, ref } from "vue";
import imageBackground from "../../../assets/img/funambulation/background.svg";
import FunambulationGame from "../../../classes/Game/FunambulationGame";
import Player from "../../../classes/Game/Player";
import PuzzleGenerator from "../../../classes/Game/PuzzleGenerator";
import GameState from "../../../classes/Utilities/GameState";
import PusherSubscription from "../../../classes/Utilities/PusherSubscription";
import Store from "../../../classes/Utilities/Store";
import GameOverStudent from "../Utilities/GameOverStudent.vue";
import GameUtilitiesPuzzle from "../Utilities/Puzzle.vue";
import GameUtilitiesWaitingStudent from "../Utilities/WaitingStudent.vue";

defineComponent({
  name: "GameFunambulationStudentPage",
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
const player = Store.loadPlayerStudent();
const state = ref(GameState.pre);
const puzzleGenerator = new PuzzleGenerator(props.game.expressions);
const puzzle = ref(puzzleGenerator.generate());
const wrongAnswerStreak = ref(0);
const gameResult = ref("draw");
const backgroundImage = { "background-image": "url(" + imageBackground + ")" };

onBeforeMount(() => {
  bindEvents();
});

onBeforeUnmount(() => {
  channel.trigger("client-leave", player);
  channel.unsubscribe();
  channel.disconnect();
});

function bindEvents(): void {
  channel.bind("client-start", () => {
    state.value = GameState.run;
  });
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
      if (result.winner !== "draw") {
        gameResult.value = result.winner === team ? "win" : "loss";
      }
    }
  );
}

function solve(correct: boolean): void {
  if (correct) {
    score();
    wrongAnswerStreak.value = 0;
  } else {
    wrongAnswerStreak.value++;
  }
  wait();
}

function score(): void {
  channel.trigger("client-score", player);
}

function wait(): void {
  const resetStreak = wrongAnswerStreak.value >= 2;
  const timeout = resetStreak ? 10000 : 2000;
  setTimeout(() => {
    puzzle.value = puzzleGenerator.generate();
    if (resetStreak) {
      wrongAnswerStreak.value = 0;
    }
  }, timeout);
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
