<script setup lang="ts">
import { Text } from "@/packages/html-editor/shapes/text.ts"
defineProps<{
  active: Text
}>()

const colors = [
  {
    value: '#ffa800',
    label: '黄色',
  },
  {
    value: '#0072ff',
    label: '蓝色',
  },
  {
    value: '#000000',
    label: '黑色',
  },
  {
    value: '#656565',
    label: '灰色',
  },
]
</script>

<template>
  <el-form
    label-width="80px"
    label-position="top"
    size="small"
  >
    <el-form-item label="文本内容">
      <el-input
        :model-value="active.innerText"
        @update:model-value="active.set('innerText', $event)"
        type="textarea"
        autosize
        style="width: 100%;"
        :style="{
          fontFamily: active.fontFamily,
          fontWeight: active.fontWeight,
          fontStyle: active.fontStyle,
          lineHeight: active.lineHeight,
          color: active.color,
          letterSpacing: active.letterSpacing + 'px',
          textAlign: active.textAlign,
        }"
      />
    </el-form-item>
    <el-form-item label="书写模式">
      <el-select
        :model-value="active.writingMode"
        @update:model-value="active.set('writingMode', $event)"
      >
        <el-option
          label="横排文本"
          value="horizontal-tb"
        />
        <el-option
          label="竖排文本"
          value="vertical-rl"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="文字颜色">
      <el-select
        :model-value="active.color"
        @update:model-value="active.set('color', $event)"
      >
        <el-option
          v-for="item in colors"
          :key="item.value"
          :value="item.value"
        >
          <div class="flex items-center">
            <el-tag :color="item.value" style="margin-right: 8px" size="small" />
            <span :style="{ color: item.value }">{{ item.label }}</span>
          </div>
        </el-option>
        <template #label>
          <el-tag :color="active.color" />
        </template>
      </el-select>
    </el-form-item>
    <el-form-item label="选择字体">
      <el-select
        :model-value="active.fontFamily"
        @update:model-value="active.set('fontFamily', $event)"
        placeholder="选择字体"
      >
        <el-option
          label="黑体‌"
          value="Noto Sans SC"
          style="font-family: 'Noto Sans SC', sans-serif"
        >
        </el-option>
        <el-option
          label="宋体"
          value="Noto Serif SC"
          style="font-family: 'Noto Serif SC', serif"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="字体大小">
      <el-input-number
        :model-value="active.fontSize"
        @update:model-value="active.set('fontSize', $event)"
        :min="1"
        :max="100"
        style="width: 100px"
      />
    </el-form-item>
    <el-form-item label="行高">
      <el-input-number
        :model-value="active.lineHeight"
        @update:model-value="active.set('lineHeight', $event)"
        :min="1"
        :max="2.0"
        :step="0.1"
        :precision="1"
        style="width: 100px"
      />
    </el-form-item>
    <el-form-item label="字间距">
      <el-input-number
        :model-value="active.letterSpacing"
        @update:model-value="active.set('letterSpacing', $event)"
        :min="-50"
        :max="50"
        :step="2"
        style="width: 100px"
      />
    </el-form-item>
<!--    <el-form-item label="对齐方式">-->
<!--      <el-radio-group-->
<!--        :model-value="active.textAlign"-->
<!--        @update:model-value="active.set('textAlign', $event)"-->
<!--      >-->
<!--        <el-radio-button-->
<!--          value="left"-->
<!--        >-->
<!--          左对齐-->
<!--        </el-radio-button>-->
<!--        <el-radio-button-->
<!--          value="center"-->
<!--        >-->
<!--          居中对齐-->
<!--        </el-radio-button>-->
<!--        <el-radio-button-->
<!--          value="right"-->
<!--        >-->
<!--          右对齐-->
<!--        </el-radio-button>-->
<!--      </el-radio-group>-->
<!--    </el-form-item>-->
    <el-form-item label="其他属性">
      <div class="flex items-center gap-2">
        <el-button-group size="small">
          <el-button
            :type="active.fontWeight==='bold'?'primary':''"
            @click="active.set('fontWeight', active.fontWeight === 'bold' ? 'normal' : 'bold')"
          >
            <span style="font-weight: bold">粗体</span>
          </el-button>
          <el-button
            :type="active.fontStyle==='italic'?'primary':''"
            @click="active.set('fontStyle', active.fontStyle === 'italic' ? 'normal' : 'italic')"
          >
            <span style="font-style: italic">斜体</span>
          </el-button>
        </el-button-group>
      </div>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.el-tag {
  border: none;
  aspect-ratio: 1;
}
:deep(.el-select__selected-item) {
  display: flex;
}
</style>
