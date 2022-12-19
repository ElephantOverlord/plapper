<template>
  <DisplayBox
    color="light"
    class="text-center gameBoxTeacher animate__animated animate__slideInDown animate__faster"
  >
    <DisplayBox
      color="gray"
      class="p-5 rounded-t-2xl rounded-b-none"
      :shadow="false"
    >
      <div class="resFontSizeExtraLarge font-bold">
        {{ title }}
      </div>
      <div class="resFontSizeLarge resMarginYTop">
        <b>plapper.ch</b>
        <i class="eva eva-arrow-forward-outline mx-3" /> Mitspielen
      </div>
    </DisplayBox>
    <DisplayBox
      color="purple"
      class="p-5 rounded-b-2xl rounded-t-none"
      :shadow="false"
    >
      <div class="font-bold resFontSizeLarge">Game-Code:</div>
      <div class="font-bold font-mono tracking-wider resFontSizeUltraLarge">
        {{ code }}
      </div>
    </DisplayBox>
    <div class="text-center resMarginY">
      <button
        :disabled="teams.red.length + teams.blue.length < 2"
        class="buttonGreen resFontSizeNormal"
        @click="start"
      >
        Spiel starten!
      </button>
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-2">
      <DisplayBox
        color="orange"
        class="p-3 rounded-t-2xl rounded-b-none xl:rounded-r-none xl:rounded-l-2xl"
        :shadow="false"
      >
        <div class="font-bold resFontSizeLarge resMarginYBottom">Team Red</div>
        <div class="resFontSizeNormal">
          <span v-if="teams.red.length <= 0">Noch keine Spieler:innen.</span>
          <span
            v-for="player of teams.red"
            :key="player.id"
            class="inline-block px-2 py-1 bg-gray-800 text-white rounded m-1"
            >{{ player.name }}</span
          >
        </div>
      </DisplayBox>
      <DisplayBox
        color="blue"
        class="p-3 rounded-b-2xl rounded-t-none xl:rounded-l-none xl:rounded-r-2xl"
        :shadow="false"
      >
        <div class="font-bold resFontSizeLarge resMarginYBottom">Team Blue</div>
        <div class="resFontSizeNormal">
          <span v-if="teams.blue.length <= 0">Noch keine Spieler:innen.</span>
          <span
            v-for="player of teams.blue"
            :key="player.id"
            class="inline-block px-2 py-1 bg-gray-800 text-white rounded m-1"
            >{{ player.name }}</span
          >
        </div>
      </DisplayBox>
    </div>
  </DisplayBox>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import Player from "../../../classes/Game/Player";
import DisplayBox from "../../Utilities/DisplayBox.vue";

defineComponent({
  name: "GameUtilitiesJoinTeams",
});

const props = defineProps({
  title: {
    type: String,
    default: "Title",
  },
  code: {
    type: String,
    default: "CODE",
  },
  teams: {
    type: Object,
    default() {
      return {
        red: [] as Array<Player>,
        blue: [] as Array<Player>,
      };
    },
  },
});

const emit = defineEmits(["start"]);

const audioStart = new Audio("/snd/start.m4a");

function start(): void {
  audioStart.play();
  emit("start");
}
</script>

<style scoped></style>
