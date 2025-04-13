<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const fonts = [
  { name: '思源黑体‌', value: 'Noto Sans SC' },
  { name: '思源宋体', value: 'Noto Serif SC' },
]

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <el-select
    v-model="modelValue"
    placeholder="选择字体"
    >
    <el-option
      v-for="font in fonts"
      :key="font.value"
      :label="font.name"
      :value="font.value"
      :style="{ fontFamily: font.value }"
    >
    </el-option>
  </el-select>
</template>

<style>
</style>
