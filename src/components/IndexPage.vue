<template>
  <div>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2"
    >
      <DashboardWelcome />
      <DashboardJoin />
      <DashboardInfo />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onBeforeMount } from "vue";
import Store from "../classes/Utilities/Store";
import DashboardInfo from "../components/Dashboard/Info.vue";
import DashboardJoin from "../components/Dashboard/Join.vue";
import DashboardWelcome from "../components/Dashboard/Welcome.vue";

onBeforeMount(() => {
  Store.clearStorage();
});

defineComponent({
  name: "IndexPage",
});
</script>

<style scoped></style>
