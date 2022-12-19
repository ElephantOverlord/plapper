<template>
  <NavigationEmpty v-if="isGame" />
  <NavigationDefault v-else />
  <div :class="isGame ? '' : 'mt-16 lg:mt-0 lg:ml-96 lg:max-w-5xl p-2'">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import NavigationDefault from "./components/Navigation/Default.vue";
import NavigationEmpty from "./components/Navigation/Empty.vue";

const router = useRoute();

const isGame = computed(
  () =>
    router.path.includes("/play/teacher") ||
    router.path.includes("/play/student")
);
</script>

<style></style>
