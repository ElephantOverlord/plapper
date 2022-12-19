<template>
  <div
    class="bg-gradient-to-br p-7"
    :class="[
      ...styleTextColor,
      ...styleBackgroundGradient,
      ...styleShadow,
      ...styleRounded,
    ]"
  >
    <div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent } from "vue";

defineComponent({
  name: "DisplayBox",
});

const props = defineProps({
  color: { type: String, default: "light" },
  shadow: { type: Boolean, default: true },
  rounded: { type: Boolean, default: true },
});

const styleTextColor = computed(() =>
  props.color === "light" || props.color === "none" ? [] : ["text-white"]
);

const styleBackgroundGradient = computed(() => {
  switch (props.color) {
    case "gray":
      return ["from-gray-700", "to-slate-600"];
    case "blue":
      return ["from-sky-700", "to-blue-500"];
    case "green":
      return ["from-emerald-700", "to-teal-600"];
    case "purple":
      return ["from-purple-700", "to-pink-600"];
    case "orange":
      return ["from-orange-700", "to-amber-600"];
    case "none":
      return [];
    default:
      return ["from-stone-100", "to-slate-100"];
  }
});

const styleShadow = computed(() => (props.shadow ? ["shadow-md"] : []));

const styleRounded = computed(() => (props.rounded ? ["rounded"] : []));
</script>

<style scoped></style>
