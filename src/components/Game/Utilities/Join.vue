<script lang="ts" setup>
import { Channel } from "pusher-js";
import { defineComponent, onBeforeMount, ref } from "vue";
import Player from "../../../classes/Game/Player";
import GameState from "../../../classes/Utilities/GameState";

defineComponent({
  name: "GameUtilitiesJoin",
});

const props = defineProps({
  game: {
    type: Object,
    default() {
      return {};
    },
  },
  channel: {
    type: Channel,
    default() {
      return { subscribed: false };
    },
  },
  state: {
    type: String,
    default: GameState.pre,
  },
});

const emit = defineEmits(["update:modelValue"]);

const players = ref([] as Array<Player>);

onBeforeMount(() => {
  bindJoinEvent();
  bindLeaveEvent();
});

function bindJoinEvent(): void {
  props.channel.bind("client-join", (player: Player) => {
    players.value.push(player);
    props.channel.trigger("client-game-" + player.id, props.game);
    emitModelValue();
  });
}

function bindLeaveEvent(): void {
  props.channel.bind("client-leave", (player: Player) => {
    if (props.state !== GameState.end) {
      const index = players.value.findIndex(
        (element) => element.id === player.id
      );
      if (index >= 0) {
        players.value.splice(index, 1);
        emitModelValue();
      }
    }
  });
}

function emitModelValue(): void {
  emit("update:modelValue", players.value);
}
</script>

<template>
  <span></span>
</template>
