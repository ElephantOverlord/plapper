<template>
  <DisplayBox
    color="light"
    class="text-center gameBoxStudent animate__animated animate__slideInDown animate__faster"
    :rounded="false"
  >
    <div class="resFontSizeNormal">Du bist dabei!</div>
    <div class="animate-spin w-1/4 mx-auto">
      <i class="eva eva-loader-outline eva-3x text-lg resMarginY" />
    </div>
    <div class="resFontSizeNormal">{{ message }}</div>
  </DisplayBox>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import DisplayBox from "../../Utilities/DisplayBox.vue";

defineComponent({
  name: "GameUtilitiesWaitingStudent",
});

const props = defineProps({
  message: {
    type: String,
    default: "Es geht bald los.",
  },
});
</script>

<style scoped></style>
