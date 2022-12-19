<template>
  <DisplayBox
    color="light"
    class="gameBoxTeacher animate__animated animate__slideInDown animate__faster"
  >
    <div id="winner" class="font-bold resFontSizeExtraLarge text-center">
      <span v-if="scoreRed > scoreBlue"> Team Red hat gewonnen! </span>
      <span v-if="scoreBlue > scoreRed"> Team Blue hat gewonnen! </span>
      <span v-if="scoreRed === scoreBlue"> Unentschieden! </span>
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-2 resMarginYTop">
      <DisplayBox
        color="orange"
        class="p-3 rounded-t-2xl rounded-b-none xl:rounded-r-none xl:rounded-l-2xl"
      >
        <div
          v-for="player of orderBy(teams.red, ['score'], ['desc'])"
          :key="player.id"
          class="grid grid-cols-2 gap-4 xl:gap-8"
        >
          <div class="text-right resFontSizeNormal">
            {{ player.name }}
          </div>
          <div class="text-left font-bold resFontSizeNormal">
            {{ player.score }} Punkte
          </div>
        </div>
      </DisplayBox>
      <DisplayBox
        color="blue"
        class="p-3 rounded-b-2xl rounded-t-none xl:rounded-l-none xl:rounded-r-2xl"
      >
        <div
          v-for="player of orderBy(teams.blue, ['score'], ['desc'])"
          :key="player.id"
          class="grid grid-cols-2 gap-4 xl:gap-8"
        >
          <div class="text-right resFontSizeNormal">
            {{ player.name }}
          </div>
          <div class="text-left font-bold resFontSizeNormal">
            {{ player.score }} Punkte
          </div>
        </div>
      </DisplayBox>
    </div>
  </DisplayBox>
</template>

<script lang="ts" setup>
import { orderBy } from "lodash";
import party from "party-js";
import { defineComponent, onMounted } from "vue";
import DisplayBox from "../../Utilities/DisplayBox.vue";

defineComponent({
  name: "GameUtilitiesWinnerTeams",
});

const props = defineProps({
  scoreRed: {
    type: Number,
    default: 0,
  },
  scoreBlue: {
    type: Number,
    default: 0,
  },
  teams: {
    type: Object,
    default() {
      return { red: [], blue: [] };
    },
  },
});

const audioFinale = new Audio("/snd/finale.m4a");

function celebrate(): void {
  audioFinale.play();
  setTimeout(() => {
    party.confetti(document.getElementById("winner") as HTMLElement, {
      count: party.variation.range(40, 60),
      spread: party.variation.range(20, 40),
      size: party.variation.range(0.5, 1.5),
    });
  }, 5000);
}

onMounted(() => {
  celebrate();
});
</script>

<style scoped></style>
