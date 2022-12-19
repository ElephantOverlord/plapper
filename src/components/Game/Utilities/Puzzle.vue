<template>
  <DisplayBox
    id="puzzle"
    color="light"
    class="text-center gameBoxStudent animate__animated animate__slideInDown animate__faster"
    :rounded="false"
  >
    <DisplayBox color="gray" class="p-5 rounded">
      <span class="resFontSizeLarge">{{ question }}</span>
    </DisplayBox>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
      <div
        v-for="(answer, index) in answers"
        :key="index"
        :class="
          answered && solution !== answer
            ? ['animate__animated', 'animate__fadeOut']
            : []
        "
      >
        <button
          :disabled="answered || !interactive"
          class="resFontSizeNormal w-full h-full p-3"
          :class="[buttonClasses[index]]"
          @click="solve(answer)"
        >
          {{ answer }}
        </button>
      </div>
    </div>
    <div>
      <slot />
    </div>
  </DisplayBox>
</template>

<script lang="ts" setup>
import party from "party-js";
import { defineComponent, ref, watch } from "vue";
import DisplayBox from "../../Utilities/DisplayBox.vue";

defineComponent({
  name: "GameUtilitiesPuzzle",
});

const props = defineProps({
  question: {
    type: String,
    default: "Question",
  },
  answers: {
    type: Array,
    default() {
      return ["Answer One", "Answer Two", "Answer Three", "Answer Four"];
    },
  },
  solution: {
    type: String,
    default: "Answer One",
  },
  id: {
    type: String,
    default: "id",
  },
  interactive: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["solved"]);

const answered = ref(false);
const buttonClasses = [
  "buttonPink",
  "buttonOrange",
  "buttonGreen",
  "buttonBlue",
];
const audioSuccess = new Audio("/snd/success.m4a");

watch(
  () => props.id,
  () => {
    answered.value = false;
  }
);

function solve(answer: string | any): void {
  answered.value = true;
  const correct = answer === props.solution;
  if (correct) {
    audioSuccess.play();
    party.confetti(document.getElementById("puzzle") as HTMLElement, {
      count: party.variation.range(40, 60),
      spread: party.variation.range(5, 20),
      size: party.variation.range(0.5, 1.5),
    });
  }
  emit("solved", correct);
}
</script>

<style scoped></style>
