<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
    <DisplayBox color="gray">
      <h1 class="mb-3">Staffellauf</h1>
      <p>
        Die Lernenden spielen in zwei Teams. Der Reihe nach müssen die
        Team-Mitglieder insgesamt 30 Aufgaben lösen. Löst ein Team-Mitglied eine
        Aufgabe korrekt, ist die nächste Person an der Reihe. Wird eine Aufgabe
        nicht korrekt gelöst, wird sie nach einer Strafzeit an das nächste
        Team-Mitglied weitergereicht. Das Team, welches zuerst alle 30 Aufgaben
        korrekt löst, gewinnt den Staffellauf.
      </p>
    </DisplayBox>

    <ConfigBook v-model="book" />

    <ConfigLessons v-if="bookValidated" v-model="expressions" :book="book" :min-expressions="minExpressions" />

    <GameConfigGame v-if="expressionsValidated">
      <GameConfigTime v-model="config.penalty" :min-time="minPenalty" :max-time="maxPenalty"
        :default-time="config.penalty"
        message="Wie lange soll die Strafzeit dauern, wenn eine Aufgabe falsch gelöst wird?" unit="Sekunden" />
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
import RelayGame from "../../../classes/Game/RelayGame";
import Expression from "../../../classes/Utilities/Expression";
import GameCode from "../../../classes/Utilities/GameCode";
import Store from "../../../classes/Utilities/Store";
import DisplayBox from "../../Utilities/DisplayBox.vue";
import ConfigBook from "../../Config/Book.vue";
import GameConfigGame from "../Config/Game.vue";
import ConfigLessons from "../../Config/Lessons.vue";
import GameConfigTime from "../Config/Time.vue";

defineComponent({
  name: "GameRelayConfigPage",
});

const book = ref({});
const expressions = ref([] as Array<Expression>);
const minExpressions = 30;
const config = ref({
  penalty: 10,
});
const minPenalty = 5;
const maxPenalty = 15;
const router = useRouter();

const bookValidated = computed(() => Object.keys(book.value).length > 0);
const expressionsValidated = computed(
  () => expressions.value.length >= minExpressions
);
const configValidated = computed(() => !isNaN(config.value.penalty));

const game = computed(() => {
  return new RelayGame(GameCode.generate(), config.value, expressions.value);
});

function start(): void {
  Store.storeGameTeacher(game.value);
  router.push({ path: "/game/play/teacher" });
}
</script>

<style scoped></style>
