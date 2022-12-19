<template>
  <span>
    {{ timeDisplay }}
  </span>
</template>

<script lang="ts" setup>
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";

defineComponent({
  name: "GameUtilitiesCountdown",
});

const props = defineProps({
  minutes: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["stop"]);

const elapsedSeconds = ref(0);
const audioBeep = new Audio("/snd/beep.m4a");
const interval = ref({} as NodeJS.Timeout);

const totalSeconds = computed(() => props.minutes * 60);
const timeDisplay = computed(() => {
  const secondsLeft = totalSeconds.value - elapsedSeconds.value;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  return seconds < 10 ? minutes + ":0" + seconds : minutes + ":" + seconds;
});

function tick(): void {
  interval.value = setInterval(() => {
    elapsedSeconds.value++;
    if (
      elapsedSeconds.value > totalSeconds.value - 11 &&
      elapsedSeconds.value < totalSeconds.value &&
      elapsedSeconds.value % 2 === 0
    ) {
      audioBeep.play();
    } else if (elapsedSeconds.value >= totalSeconds.value) {
      clearInterval(interval.value);
      emit("stop");
    }
  }, 1000);
}

onMounted(() => {
  tick();
});

onBeforeUnmount(() => {
  clearInterval(interval.value);
});
</script>

<style scoped></style>
