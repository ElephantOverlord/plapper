<template>
  <DisplayBox color="green">
    <h1 class="mb-3">
      <i class="eva eva-play-circle-outline mr-2" />Mitspielen
    </h1>
    <label for="name" class="block mb-2"
      >Wie möchtest du im Spiel heissen?</label
    >
    <input
      id="name"
      v-model="name"
      :disabled="joining"
      type="text"
      autocomplete="off"
      placeholder="Ich heisse..."
      class="w-full"
      minlength="1"
      maxlength="20"
      @keyup.enter="join"
    />
    <label for="key" class="block mt-5 mb-2">Wie lautet der Game-Code?</label>
    <input
      id="key"
      v-model="code"
      :disabled="joining"
      type="text"
      autocomplete="off"
      placeholder="Der Game-Code lautet..."
      class="w-full"
      minlength="4"
      maxlength="4"
      @keyup.enter="join"
    />
    <DisplayBox
      v-if="inputError || connectionError"
      color="light"
      class="px-5 py-3 text-black rounded shadow-none my-5 animate__animated animate__fadeIn animate__faster"
    >
      <span v-if="inputError">Gib deinen Namen und den Game-Code ein.</span>
      <span v-if="connectionError"
        >Überprüfe deinen Game-Code. Es konnte keine Verbindung hergestellt
        werden.</span
      >
    </DisplayBox>
    <div class="text-right mt-5">
      <button v-if="!joining" @click="join">Mitspielen!</button>
      <div v-else class="text-center animate-spin">
        <i class="eva eva-loader-outline eva-2x" />
      </div>
    </div>
  </DisplayBox>
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import Player from "../../classes/Game/Player";
import PusherSubscription from "../../classes/Utilities/PusherSubscription";
import Store from "../../classes/Utilities/Store";
import Game from "../../interfaces/Game";
import DisplayBox from "../Utilities/DisplayBox.vue";

defineComponent({
  name: "DashboardJoin",
});

const name = ref("");
const code = ref("");
const joining = ref(false);
const inputError = ref(false);
const connectionError = ref(false);
const router = useRouter();

const player = computed(() => new Player(name.value));
const validated = computed(
  () => name.value.length > 0 && code.value.length === 4
);
const formattedCode = computed(() => code.value.toUpperCase());

function join(): void {
  joining.value = true;
  inputError.value = false;
  connectionError.value = false;
  if (validated.value) {
    const timeout = setTimeout(() => {
      connectionFail();
    }, 10000);
    connect(timeout);
  } else {
    inputFail();
  }
}

function connect(failTimeout: NodeJS.Timeout): void {
  const channel = PusherSubscription(formattedCode.value);
  channel.bind("pusher:subscription_succeeded", () => {
    channel.trigger("client-join", player.value);
  });
  channel.bind("client-game-" + player.value.id, (game: Game) => {
    clearTimeout(failTimeout);
    Store.storeGameStudent(game);
    Store.storePlayerStudent(player.value);
    channel.unsubscribe();
    channel.disconnect();
    router.push({ path: "/game/play/student" });
  });
}

function inputFail(): void {
  inputError.value = true;
  joining.value = false;
}

function connectionFail(): void {
  connectionError.value = true;
  joining.value = false;
}
</script>

<style scoped></style>
