<script setup lang="ts">
import { ref } from 'vue'
import { generateBarcode } from '@/views/barcode.ts'


const svg = generateBarcode('24700038855', {
  ltText: '1378923797',
  rbText: 'Made In China',
  tcText: 'Slate Grey',
  rtText: 'XL',
  lbText: '5938105521'
})
if (!svg) {
  throw new Error('Failed to generate barcode')
}
const svgString = new XMLSerializer().serializeToString(svg)
const svgRef = ref(svgString)

</script>

<template>
  <main>
    <div v-html="svgRef"></div>
  </main>
</template>
