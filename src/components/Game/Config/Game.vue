<template>
  <DisplayBox
    color="blue"
    class="animate__animated animate__fadeIn animate__faster"
  >
    <h2 class="mb-2">
      <i class="eva eva-settings-2-outline mr-2" />Spiel-Einstellungen
    </h2>
    <slot />
  </DisplayBox>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import DisplayBox from "../../Utilities/DisplayBox.vue";

defineComponent({
  name: "GameConfigGame",
});
</script>

<style scoped></style>
