<template>
  <DisplayBox color="gray">
    <h1 class="mb-3">
      <i class="eva eva-info-outline mr-2" />Was ist plapper.ch?
    </h1>
    <p class="mb-3">
      <b>plapper.ch</b> wurde als digitale Spieleplattform zur Förderung im
      Fremdsprachen-Unterricht entwickelt. Als Sekundarlehrperson mit
      Informatik-Hintergrund war es mir ein Anliegen, unterhaltsame und
      spannende digitale Lernmöglichkeiten zu schaffen.
    </p>
    <p class="mb-3">
      Der Aufwand begrenzt sich für die Lehrperson auf ein Minimum: Einfach
      Spiel und Lehrmittel auswählen - los gehts!
    </p>
    <p>
      Die Plattform befindet sich derzeit noch in der Entwicklung. Sie wird
      laufend weiterentwickelt und mit neuen Spielen und Möglichkeiten ergänzt.
      Alle Spiele sind kostenlos und können ohne Anmeldung oder Registrierung
      genutzt werden.
    </p>
  </DisplayBox>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import DisplayBox from "../Utilities/DisplayBox.vue";

defineComponent({
  name: "DashboardInfo",
});
</script>

<style scoped></style>
