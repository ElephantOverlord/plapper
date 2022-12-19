<template>
  <div>
    <div class="grid grid-cols-2">
      <DisplayBox
        color="orange"
        class="font-bold resFontSizeLarge uppercase p-3"
        :shadow="false"
        :rounded="false"
      >
        <span>Team Red</span>
        <span class="float-right">{{ scoreRed }}</span>
      </DisplayBox>
      <DisplayBox
        color="blue"
        class="font-bold resFontSizeLarge text-right uppercase p-3"
        :shadow="false"
        :rounded="false"
      >
        <span>Team Blue</span>
        <span class="float-left">{{ scoreBlue }}</span>
      </DisplayBox>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import DisplayBox from "../../Utilities/DisplayBox.vue";

defineComponent({
  name: "GameUtilitiesScoreboardTeams",
});

defineProps({
  scoreRed: {
    type: Number,
    default: 0,
  },
  scoreBlue: {
    type: Number,
    default: 0,
  },
});
</script>

<style scoped></style>
