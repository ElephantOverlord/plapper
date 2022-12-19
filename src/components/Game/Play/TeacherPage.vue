<template>
  <GameFunambulationTeacherPage
    v-if="game.type === 'funambulation'"
    :key="key"
    :game="game"
  />
  <GamePlayerVsPlayerTeacherPage
    v-if="game.type === 'player-vs-player'"
    :key="key"
    :game="game"
  />
  <GameRelayTeacherPage v-if="game.type === 'relay'" :key="key" :game="game" />
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import Store from "../../../classes/Utilities/Store";
import GameFunambulationTeacherPage from "../Funambulation/TeacherPage.vue";
import GamePlayerVsPlayerTeacherPage from "../PlayerVsPlayer/TeacherPage.vue";
import GameRelayTeacherPage from "../Relay/TeacherPage.vue";

defineComponent({
  name: "GamePlayTeacherPage",
});

const game = Store.loadGameTeacher();
const key = new Date().getTime();
</script>

<style scoped></style>
