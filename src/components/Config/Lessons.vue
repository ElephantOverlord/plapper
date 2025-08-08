<template>
  <DisplayBox
    color="green"
    class="animate__animated animate__fadeIn animate__faster"
  >
    <h2 class="mb-2"><i class="eva eva-list-outline mr-2" />Lerneinheiten</h2>

    <p class="mb-5">
      Welche Lerneinheiten möchten Sie verwenden? Es müssen
      <b>mindestens {{ minExpressions }} Vokabeln</b> ausgewählt werden. Die
      aktuelle Auswahl enthält <b>{{ expressions.length }} Vokabeln</b>.
    </p>

    <div v-for="(unit, unitKey) in book.expressions" :key="unitKey">
      <h3 class="mb-1">
        {{ unit.name }}
      </h3>
      <span
        v-for="(lesson, lessonKey) in unit.lessons"
        :key="lessonKey"
        class="mr-8 inline-block"
      >
        <input
          :id="unitKey + '_' + lessonKey"
          v-model="selected"
          type="checkbox"
          class="mr-2"
          :value="{ unit: unitKey, lesson: lessonKey }"
        /><label :for="unitKey + '_' + lessonKey">{{ lesson.name }}</label>
      </span>
      <hr class="border-emerald-100 mt-3 mb-2 opacity-20" />
    </div>
    <div class="mt-7">
      <input
        id="selectAllLessons"
        v-model="allSelected"
        type="checkbox"
        class="mr-2"
      /><label for="selectAllLessons">Alle Lerneinheiten auswählen</label>
    </div>
  </DisplayBox>
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref, watch } from "vue";
import Expression from "../../classes/Utilities/Expression";
import DisplayBox from "../Utilities/DisplayBox.vue";

defineComponent({
  name: "ConfigLessons",
});

const props = defineProps({
  book: {
    type: Object,
    default() {
      return { expressions: [] as Array<{ lessons: Array<Expression> }> };
    },
  },
  minExpressions: {
    type: Number,
    default: 30,
  },
});

const emit = defineEmits(["update:modelValue"]);

const expressions = ref([] as Array<Expression>);
const selected = ref([] as Array<{ unit: number; lesson: number }>);

const allSelected = computed({
  get: () => selected.value.length === completeSelection.value.length,
  set: (value) =>
    value ? (selected.value = completeSelection.value) : (selected.value = []),
});
const completeSelection = computed(() => {
  const selection = [];
  for (const unitIndex in props.book.expressions) {
    for (const lessonIndex in props.book.expressions[unitIndex].lessons) {
      selection.push({
        unit: Number.parseInt(unitIndex),
        lesson: Number.parseInt(lessonIndex),
      });
    }
  }
  return selection;
});

watch(
  () => selected.value,
  () => {
    expressions.value = [];
    for (const selectedItem of selected.value) {
      expressions.value.push(
        ...props.book.expressions[selectedItem.unit].lessons[
          selectedItem.lesson
        ].expressions
      );
    }
    emit("update:modelValue", expressions.value);
  }
);

watch(
  () => props.book,
  () => {
    selected.value = [];
  }
);
</script>

<style scoped></style>
