<template>
  <GameFunambulationStudentPage
    v-if="game.type === 'funambulation'"
    :key="key"
    :game="game"
  />
  <GamePlayerVsPlayerStudentPage
    v-if="game.type === 'player-vs-player'"
    :key="key"
    :game="game"
  />
  <GameRelayStudentPage v-if="game.type === 'relay'" :key="key" :game="game" />
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import Store from "../../../classes/Utilities/Store";
import GameFunambulationStudentPage from "../Funambulation/StudentPage.vue";
import GamePlayerVsPlayerStudentPage from "../PlayerVsPlayer/StudentPage.vue";
import GameRelayStudentPage from "../Relay/StudentPage.vue";

defineComponent({
  name: "GamePlayStudentPage",
});

const game = Store.loadGameStudent();
const key = new Date().getTime();
</script>

<style scoped></style>
