<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
    <DisplayBox color="gray">
      <h1 class="mb-3">Seiltanzen</h1>
      <p>
        Die Lernenden spielen in zwei Teams. Mit jeder korrekt
        beantworteten Frage locken sie ein Huhn, welches sich auf ein Seil
        verirrt hat, näher auf ihre Seite. Wir das Huhn erfolgreich auf die
        eigene Seite gelockt, erhält das Team einen Punkt. Gewonnen hat das
        Team, welches nach Ablauf der Spielzeit mehr Punkte gesammelt hat.
      </p>
    </DisplayBox>

    <ConfigBook v-model="book" />

    <ConfigLessons v-if="bookValidated" v-model="expressions" :book="book" :min-expressions="minExpressions" />

    <GameConfigGame v-if="expressionsValidated">
      <GameConfigTime v-model="config.time" :min-time="minTime" :max-time="maxTime" :default-time="config.time" />
    </GameConfigGame>
  </div>
  <div v-if="expressionsValidated && configValidated"
    class="text-right animate__animated animate__fadeInUp animate__faster mt-2">
    <button class="text-lg" @click="start">
      <i class="eva eva-play-circle-outline mr-1" />Spiel starten
    </button>
  </div>
</template>

<script lang="ts" setup>
import { isNaN } from "lodash";
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import FunambulationGame from "../../../classes/Game/FunambulationGame";
import Expression from "../../../classes/Utilities/Expression";
import GameCode from "../../../classes/Utilities/GameCode";
import Store from "../../../classes/Utilities/Store";
import DisplayBox from "../../Utilities/DisplayBox.vue";
import ConfigBook from "../../Config/Book.vue";
import GameConfigGame from "../Config/Game.vue";
import ConfigLessons from "../../Config/Lessons.vue";
import GameConfigTime from "../Config/Time.vue";

defineComponent({
  name: "GameFunambulationConfigPage",
});

const book = ref({});
const expressions = ref([] as Array<Expression>);
const minExpressions = 30;
const config = ref({
  time: 5,
});
const minTime = 2;
const maxTime = 10;
const router = useRouter();

const bookValidated = computed(() => Object.keys(book.value).length > 0);
const expressionsValidated = computed(
  () => expressions.value.length >= minExpressions
);
const configValidated = computed(() => !isNaN(config.value.time));

const game = computed(() => {
  return new FunambulationGame(
    GameCode.generate(),
    config.value,
    expressions.value
  );
});

function start(): void {
  Store.storeGameTeacher(game.value);
  router.push({ path: "/game/play/teacher" });
}
</script>

<style scoped></style>
