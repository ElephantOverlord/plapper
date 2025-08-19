<template>
  <div class="fixed left-0 top-0 w-screen lg:h-screen lg:w-96 z-50 lg:p-2 lg:pr-0">
    <div class="bg-gradient-to-br from-indigo-700 to-purple-600 text-white shadow-md lg:h-full lg:rounded"
      :class="!closed ? 'h-screen' : 'h-auto'">
      <div class="py-5 text-center">
        <router-link to="/" class="inline" @click="close(true)">
          <img src="../../assets/img/logo_minimal.svg" class="lg:hidden inline-block h-6" alt="plapper.ch Logo" />
          <img src="../../assets/img/logo.svg" class="hidden lg:inline-block h-36" alt="plapper.ch Logo" />
        </router-link>
        <i class="eva eva-2x absolute right-0 top-8 -mt-4 mr-5 cursor-pointer lg:invisible"
          :class="closed ? 'eva-menu' : 'eva-close'" @click="close(!closed)" />
      </div>
      <div class="lg:block" :class="closed ? 'hidden' : 'block'">
        <div class="px-2 py-2 text-xl font-bold mx-8">Spiele</div>
        <router-link class="navLink" to="/game/funambulation/config" @click="close(true)">
          Seiltanzen
        </router-link>
        <router-link class="navLink" to="/game/player-vs-player/config" @click="close(true)">
          Zweikampf
        </router-link>
        <router-link class="navLink" to="/game/relay/config" @click="close(true)">
          Staffellauf
        </router-link>
      </div>
      <div class="lg:block mt-6" :class="closed ? 'hidden' : 'block'">
        <div class="px-2 py-2 text-xl font-bold mx-8">Werkzeuge</div>
        <router-link class="navLink" to="/tool/vocabulary-test-generator" @click="close(true)">
          Wortschatz-Test Generator
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";

defineComponent({
  name: "NavigationDefault",
});

const closed = ref(true);

function close(close: boolean): void {
  closed.value = close;
}
</script>

<style scoped>
.navLink {
  @apply block px-5 py-2 mx-8 mb-1 text-lg no-underline text-purple-100 bg-fuchsia-400 bg-opacity-10 rounded;
}

.navLink:hover {
  @apply bg-fuchsia-200 bg-opacity-10;
}

.navLink.router-link-active {
  @apply bg-fuchsia-200 bg-opacity-20 text-white;
}
</style>
