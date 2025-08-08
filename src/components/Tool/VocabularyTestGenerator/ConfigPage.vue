<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2"
  >
    <DisplayBox color="gray">
      <h1 class="mb-3">Vokabular-Test Generator</h1>
      <p>
        Generieren Sie einen Vokabular-Test für Ihre Klasse. Wählen Sie die Anzahl
        der zu prüfenden Vokabeln, ein Lehrmittel und die gewünschten Lerneinheiten
        aus. Der Test wird automatisch, druckfertig und mit Lösungen generiert und
        kann als PDF-Datei heruntergeladen werden.
      </p>
    </DisplayBox>

    <DisplayBox color="blue">
      <h2 class="mb-2"><i class="eva eva-message-circle-outline mr-2" />Anzahl Vokabeln</h2>
      <p class="mb-3">
        Wie viele Vokabel sollen geprüft werden? Sie können <b>zwischen {{ expressionsMin }}
        und {{ expressionsMax }} Vokabeln</b> wählen.
      </p>
      <input
        id="expressionsCount"
        v-model="expressionsCount"
        type="number"
        :min="expressionsMin"
        :max="expressionsMax"
        class="w-20 mr-2"
      />
    </DisplayBox>

    <ConfigBook v-model="book" />

    <ConfigLessons
      v-if="bookValidated"
      v-model="expressions"
      :book="book"
      :min-expressions="expressionsCount"
    />
  </div>
  <div
    v-if="expressionsValidated"
    class="text-right animate__animated animate__fadeInUp animate__faster mt-2"
  >
    <button class="text-lg" @click="start">Test generieren!</button>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import Expression from "../../../classes/Utilities/Expression";
import DisplayBox from "../../Utilities/DisplayBox.vue";
import ConfigBook from "../../Config/Book.vue";
import ConfigLessons from "../../Config/Lessons.vue";

defineComponent({
  name: "ToolVocabularyTestGeneratorConfigPage",
});

const book = ref({});
const expressions = ref([] as Array<Expression>);
const expressionsCount = ref(20);
const expressionsMin = 10;
const expressionsMax = 30;
const router = useRouter();

const bookValidated = computed(() => Object.keys(book.value).length > 0);
const expressionsValidated = computed(
  () => expressions.value.length >= expressionsCount.value
);

function start(): void {
  /** Todo: Generate the test */
  alert('TODO: Generate the test');
  //router.push({ path: "/game/play/teacher" });
}
</script>

<style scoped></style>
