<template>
  <DisplayBox color="purple">
    <h1 class="mb-3">Spielend Sprachen lernen!</h1>
    <p class="text-lg mb-3">
      Auf <b>plapper.ch</b> finden Sie kostenlose Online-Sprachspiele, basierend
      auf den gängigen kantonalen Lehrmitteln und dem Lehrplan 21.
    </p>
    <p class="text-lg">
      Wählen Sie ein Spiel und das gewünschte Lehrmittel aus und legen Sie
      direkt los. Ihre Schülerinnen und Schüler können sofort via Smartphone,
      Tablet oder Notebook mitspielen!
    </p>
  </DisplayBox>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import DisplayBox from "../Utilities/DisplayBox.vue";

defineComponent({
  name: "DashboardWelcome",
});
</script>

<style scoped></style>
