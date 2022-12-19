<template>
  <DisplayBox color="purple">
    <h2 class="mb-2"><i class="eva eva-book-open-outline mr-2" />Lehrmittel</h2>
    <p class="mb-3">Welches Lehrmittel möchten Sie im Spiel verwenden?</p>
    <select v-model="selected" class="w-full" @change="fetchBook">
      <option selected disabled :value="-1">Lehrmittel</option>
      <option v-for="(bookStub, key) in library" :key="key" :value="key">
        {{ bookStub.name }}
      </option>
    </select>
  </DisplayBox>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import DisplayBox from "../../Utilities/DisplayBox.vue";

defineComponent({
  name: "GameConfigBook",
});

const emit = defineEmits(["update:modelValue"]);

const selected = ref(-1);
const library = [
  {
    name: "Dis Donc! 7E",
    file: "dis_donc_7e.json",
  },
  {
    name: "Dis Donc! 7G",
    file: "dis_donc_7g.json",
  },
  {
    name: "Dis Donc! 8E",
    file: "dis_donc_8e.json",
  },
  {
    name: "Dis Donc! 8G",
    file: "dis_donc_8g.json",
  },
  {
    name: "Dis Donc! 9E",
    file: "dis_donc_9e.json",
  },
  {
    name: "Dis Donc! 9G",
    file: "dis_donc_9g.json",
  },
];

function fetchBook(): void {
  fetch("/voc/" + library[selected.value].file).then((response) => {
    response.json().then((expressions) => {
      emit("update:modelValue", {
        name: library[selected.value].name,
        file: library[selected.value].file,
        expressions: expressions,
      });
    });
  });
}
</script>

<style scoped></style>
