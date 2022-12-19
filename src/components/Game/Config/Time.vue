<template>
  <div>
    <p class="mb-3">{{ message }}</p>
    <input
      id="time"
      v-model="time"
      type="number"
      :min="minTime"
      :max="maxTime"
      class="w-20 mr-2"
      @change="set"
    />
    <label for="time">{{ unit }}</label>
  </div>
</template>

<script lang="ts" setup>
import { isNaN } from "lodash";
import { defineComponent, ref } from "vue";

defineComponent({
  name: "GameConfigTime",
});

const props = defineProps({
  minTime: {
    type: Number,
    default: 5,
  },
  maxTime: {
    type: Number,
    default: 15,
  },
  defaultTime: {
    type: Number,
    default: 10,
  },
  message: {
    type: String,
    default: "Wie lange soll das Spiel dauern?",
  },
  unit: {
    type: String,
    default: "Minuten",
  },
});

const emit = defineEmits(["update:modelValue"]);

const time = ref(props.defaultTime);

function validate(): void {
  if (isNaN(time.value) || time.value < props.minTime) {
    time.value = props.minTime;
  } else if (time.value > props.maxTime) {
    time.value = props.maxTime;
  }
}

function set(): void {
  validate();
  emit("update:modelValue", time.value);
}
</script>

<style scoped></style>
