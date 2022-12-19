<template>
  <DisplayBox
    color="light"
    class="text-center gameBoxStudent animate__animated animate__slideInDown animate__faster"
  >
    <div class="resMarginYBottom">Das Spiel ist beendet.</div>
    <div class="font-bold">
      <div v-if="result === 'draw'">Unentschieden!</div>
      <div v-else>
        {{
          result === "win"
            ? "Dein Team hat gewonnen!"
            : "Dein Team hat verloren!"
        }}
      </div>
    </div>
  </DisplayBox>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import DisplayBox from "../../Utilities/DisplayBox.vue";

defineComponent({
  name: "GameUtilitiesGameOverStudent",
});

const props = defineProps({
  result: {
    type: String,
    default: "draw",
  },
});
</script>

<style scoped></style>
