<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
    <DisplayBox color="gray">
      <h1 class="mb-3">Wortschatz-Test Generator</h1>
      <p>
        Generieren Sie einen Wortschatz-Test für Ihre Klasse. Wählen Sie die Anzahl
        der zu prüfenden Vokabeln, ein Lehrmittel und die gewünschten Lerneinheiten
        aus. Der Test und passende Lösungen werden automatisch druckfertig für Sie
        generiert.
      </p>
    </DisplayBox>

    <DisplayBox color="blue">
      <h2 class="mb-2"><i class="eva eva-message-circle-outline mr-2" />Anzahl Vokabeln</h2>
      <p class="mb-3">
        Wie viele Vokabel sollen geprüft werden? Sie können <b>zwischen {{ expressionsMin }}
          und {{ expressionsMax }} Vokabeln</b> wählen.
      </p>
      <input id="expressionsCount" v-model="expressionsCount" type="number" :min="expressionsMin" :max="expressionsMax"
        class="w-20 mr-2" />
    </DisplayBox>

    <ConfigBook v-model="book" />

    <ConfigLessons v-if="bookValidated" v-model="expressions" :book="book" :min-expressions="expressionsCount" />
  </div>
  <div v-if="expressionsValidated" class="text-right animate__animated animate__fadeInUp animate__faster mt-2">
    <button class="text-lg" @click="generatePDF">Test und Lösung herunterladen!</button>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref } from "vue";
import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import { shuffle } from "lodash";
import { take } from "lodash";
import { takeRight } from "lodash";
import { round } from "lodash";
import Expression from "../../../classes/Utilities/Expression";
import DisplayBox from "../../Utilities/DisplayBox.vue";
import ConfigBook from "../../Config/Book.vue";
import ConfigLessons from "../../Config/Lessons.vue";
import { TDocumentDefinitions } from "pdfmake/interfaces";

defineComponent({
  name: "ToolVocabularyTestGeneratorConfigPage",
});

const book = ref({} as any);
const expressions = ref([] as Array<Expression>);
const expressionsCount = ref(20);
const expressionsMin = 10;
const expressionsMax = 30;

const bookValidated = computed(() => Object.keys(book.value).length > 0);
const expressionsValidated = computed(
  () => expressions.value.length >= expressionsCount.value
);

const shuffledExpressions = computed(() => shuffle(expressions.value));

const translationExerciseExpressionArrays = computed(() => {
  const chosenExpressions = take(shuffledExpressions.value, round(expressionsCount.value / 3 * 2));
  const tableHeader = [{ text: 'Deutsch', style: 'table_header' }, { text: 'Fremdsprache', style: 'table_header' }];
  const expressionArrays = {
    'exercise': [tableHeader] as Array<any>,
    'solution': [tableHeader] as Array<any>,
  };
  for (let i = 0; i < chosenExpressions.length; i++) {
    const expression = chosenExpressions[i];
    expressionArrays.exercise.push((i % 2 === 0) ? [expression.native, ' '] : [' ', expression.foreign]);
    expressionArrays.solution.push([expression.native, expression.foreign]);
  }
  return expressionArrays;
});

const assignmentExerciseExpressionArrays = computed(() => {
  const chosenExpressions = takeRight(shuffledExpressions.value, expressionsCount.value - translationExerciseExpressionArrays.value.exercise.length + 1);
  const shuffledChosenExpressions = shuffle(chosenExpressions);
  const tableHeader = [
    { text: 'Nr', style: 'table_header' },
    { text: 'Audruck', style: 'table_header' },
    { text: 'Nr', style: 'table_header' },
    { text: 'Übersetzung', style: 'table_header' }
  ];
  const expressionArrays = {
    'exercise': [tableHeader] as Array<any>,
    'solution': [tableHeader] as Array<any>,
  };
  for (let i = 0; i < chosenExpressions.length; i++) {
    const expression = chosenExpressions[i];
    const shuffledExpression = shuffledChosenExpressions[i];
    expressionArrays.exercise.push([i + 1, expression.foreign, ' ', shuffledExpression.native]);
    let solutionNumber = 0;
    for (let j = 0; j < chosenExpressions.length; j++) {
      if (chosenExpressions[j].native === shuffledExpression.native) {
        solutionNumber = j + 1;
      }
    }
    expressionArrays.solution.push([i + 1, expression.foreign, solutionNumber, shuffledExpression.native]);
  }
  return expressionArrays;
});

function generateMakepdfTemplate(solution: boolean): TDocumentDefinitions {
  return {
    // PDF configuration
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [25, 25, 25, 25],
    watermark: { text: (solution ? 'Lösung' : ' '), color: 'red', opacity: 0.3, bold: true, italics: false },
    content: [
      // Header section
      { text: 'Wortschatz-Test', style: 'heading_1' },
      { text: book.value.name, style: 'heading_1_subtitle' },
      {
        style: 'table',
        table: {
          widths: ['*', '*', 60, 60],
          headerRows: 1,
          body: [
            [
              { text: 'Name', style: 'table_header' },
              { text: 'Datum', style: 'table_header' },
              { text: 'Punkte', style: 'table_header' },
              { text: 'Note', style: 'table_header' },
            ],
            [' ', ' ', ' ', ' ',]
          ]
        }
      },
      // Spacer
      { text: ' \n ' },
      // Translation exercise
      { text: 'Aufgabe 1: Übersetzung (' + (translationExerciseExpressionArrays.value.exercise.length - 1) + ' P)', style: 'heading_2' },
      { text: 'Übersetzte die folgenden Audrücke in die jeweils andere Sprache:' },
      {
        style: 'table',
        table: {
          widths: ['*', '*'],
          headerRows: 1,
          body: (solution ? translationExerciseExpressionArrays.value.solution : translationExerciseExpressionArrays.value.exercise),
        }
      },

      // assignment exercise
      { text: 'Aufgabe 2: Zuweisung (' + (assignmentExerciseExpressionArrays.value.exercise.length - 1) + ' P)', style: 'heading_2', pageBreak: 'before' },
      { text: 'Welcher Ausdruck gehört zu welcher Übersetzung? Notiere bei der korrekten Übersetzung die richtige Zahl:' },
      {
        style: 'table',
        table: {
          widths: ['auto', '*', 'auto', '*'],
          headerRows: 1,
          body: (solution ? assignmentExerciseExpressionArrays.value.solution : assignmentExerciseExpressionArrays.value.exercise),
        }
      },
    ],

    styles: {
      heading_1: {
        fontSize: 22,
        bold: true,
        margin: [0, 0, 0, 0]
      },
      heading_1_subtitle: {
        fontSize: 11,
        margin: [0, 0, 0, 0],
      },
      heading_2: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 5]
      },
      table: {
        margin: [0, 15, 0, 15]
      },
      table_header: {
        bold: true,
        fontSize: 14,
        color: 'black'
      }
    },
    defaultStyle: {
      fontSize: 14,
    }
  }
}

function generatePDF() {
  // @tsignore
  pdfMake.vfs = vfsFonts.vfs;
  pdfMake
    .createPdf(generateMakepdfTemplate(false))
    .download('Wortschatz-Test');
  pdfMake
    .createPdf(generateMakepdfTemplate(true))
    .download('Wortschatz-Test_Loesung');
  console.log('did it');
}
</script>

<style scoped></style>
