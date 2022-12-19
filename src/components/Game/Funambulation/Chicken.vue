<template>
  <div class="w-full absolute bottom-0 left-0">
    <img
      id="chicken"
      alt="Huhn"
      src="../../../assets/img/funambulation/bird.gif"
      class="absolute"
      style="image-rendering: pixelated"
    />
    <img
      alt="Spielfeld"
      src="../../../assets/img/funambulation/field.png"
      class="w-full"
    />
  </div>
</template>

<script lang="ts" setup>
import anime from "animejs";
import party from "party-js";
import { defineComponent, watch } from "vue";

defineComponent({
  name: "GameFunambulationChicken",
});

const props = defineProps({
  position: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["score"]);

const audioChicken = new Audio("/snd/chicken.m4a");
const stepsToWin = 4;

watch(
  () => props.position,
  () => {
    if (props.position >= -stepsToWin && props.position <= stepsToWin) {
      move();
    }
    if (props.position <= -stepsToWin) {
      celebrate();
      emit("score", "red");
    }
    if (props.position >= stepsToWin) {
      celebrate();
      emit("score", "blue");
    }
  }
);

function move(): void {
  const vwSteps = 6 * props.position;
  anime({
    targets: "#chicken",
    translateX: vwSteps + "vw",
    duration: 500,
  });
}

function celebrate(): void {
  party.sparkles(document.getElementById("chicken") as HTMLElement, {
    count: party.variation.range(20, 40),
    size: party.variation.range(0.5, 1.5),
  });
  audioChicken.play();
}
</script>

<style scoped>
#chicken {
  width: 5vw;
  top: 7vw;
  left: 50%;
  margin-left: -2.5vw;
}
</style>
