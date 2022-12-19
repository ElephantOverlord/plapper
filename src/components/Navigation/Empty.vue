<template>
  <div
    class="bg-gradient-to-br from-indigo-700 to-purple-600 text-white fixed left-0 top-0 w-screen border-r border-purple-900 shadow-md z-50"
  >
    <div class="my-5 text-center">
      <router-link to="/" class="inline">
        <img
          src="../../assets/img/logo_minimal.svg"
          class="inline-block h-6"
          alt="plapper.ch Logo"
        />
      </router-link>
      <router-link to="/">
        <i
          class="eva eva-home-outline eva-2x absolute right-0 top-8 -mt-4 mr-5"
        />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";

defineComponent({
  name: "NavigationEmpty",
});
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
