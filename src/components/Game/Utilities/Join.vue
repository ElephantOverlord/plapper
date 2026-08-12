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

const emit = defineEmits(["update:modelValue", "player-removed"]);

const players = ref([] as Array<Player>);

onBeforeMount(() => {
  bindPresenceEvents();
});

function bindPresenceEvents(): void {
  props.channel.bind("pusher:member_added", (member: PresenceMember) => {
    addPlayer(member);
  });
  props.channel.bind("pusher:member_removed", (member: PresenceMember) => {
    removePlayer(member.user_id ?? member.id);
  });
  props.channel.bind("pusher:subscription_succeeded", () => {
    const members = (props.channel as Channel & PresenceChannelLike).members;
    members?.each((member: PresenceMember) => addPlayer(member));
  });
}

function addPlayer(member: PresenceMember): void {
  const player = member.info;
  if (!player || player.role !== "student") return;

  const index = players.value.findIndex((element) => element.id === player.id);
  if (index >= 0) {
    players.value[index] = player;
  } else {
    players.value.push(player);
  }
  props.channel.trigger("client-game-" + player.id, props.game);
  emitModelValue();
}

function removePlayer(playerId: string): void {
  if (props.state === GameState.end) return;
  const index = players.value.findIndex((element) => element.id === playerId);
  if (index >= 0) {
    players.value.splice(index, 1);
    emitModelValue();
    emit("player-removed", playerId);
  }
}

function emitModelValue(): void {
  emit("update:modelValue", players.value);
}

interface PresenceMember {
  id: string;
  user_id?: string;
  info: Player & { role?: string };
}

interface PresenceChannelLike {
  members?: {
    each(callback: (member: PresenceMember) => void): void;
  };
}
</script>

<template>
  <span></span>
</template>
