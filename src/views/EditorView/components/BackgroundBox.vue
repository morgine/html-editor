<script setup lang="ts">
import { ElementObject } from "@/packages/html-editor/object.ts"
import { ref, watch } from "vue"
const props = defineProps<{
  obj: ElementObject
}>()
type backgroundType = 'image' | 'color'
const bgType = ref<backgroundType>('color')

// 处理图片上传前转换
const handleBeforeUpload = (file: File) => {
  return new Promise<boolean>((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        // 使用set方法更新背景图片
        props.obj.set('backgroundImage', e.target.result as string)
      }
      resolve(false) // 阻止默认上传行为
    }
    reader.readAsDataURL(file)
  })
}

const colors = [
  {
    value: '#835a00',
    bgColor: '#fff7e5',
    label: '黄色皮纹纸',
  },
  {
    value: '#00407c',
    bgColor: '#e2f1ff',
    label: '蓝色皮纹纸',
  },
  {
    value: '#125e00',
    bgColor: '#eaffe6',
    label: '绿色皮纹纸',
  },
]

const selectedColor = ref(colors.find(item=>item.bgColor === props.obj.backgroundColor) || colors[0])
watch(selectedColor, (v) => {
  props.obj.set('backgroundColor', v.bgColor)
}, {immediate: true})
</script>

<template>
  <el-form
    label-width="80px"
    label-position="top"
    size="small"
  >
    <el-form-item v-if="bgType === 'color'" label="选择纸张材质">
      <el-select
        v-model="selectedColor"
        value-key="value"
      >
        <el-option
          v-for="item in colors"
          :key="item.value"
          :value="item"
        >
          <div class="flex items-center">
            <el-tag :color="item.value" style="margin-right: 8px" size="small" />
            <span :style="{ color: item.value }">{{ item.label }}</span>
          </div>
        </el-option>
        <template #label>
          <div class="flex items-center">
            <el-tag :color="selectedColor.value" style="margin-right: 8px" size="small" />
            <span :style="{ color: selectedColor.value }">{{ selectedColor.label }}</span>
          </div>
        </template>
      </el-select>
    </el-form-item>
    <template v-else>
      <el-form-item label="选择图片">
        <el-upload
          action="#"
          :auto-upload="true"
          :show-file-list="false"
          :before-upload="handleBeforeUpload"
          accept="image/*"
        >
          <el-button type="primary">点击上传</el-button>
          <template #tip>
            <div class="el-upload__tip">
              请上传图片文件
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="填充方式">
        <el-select
          :model-value="obj.backgroundSize"
          @update:model-value="obj.set('backgroundSize', $event)"
        >
          <el-option
            label="填充(拉升)"
            value="cover"
          />
          <el-option
            label="覆盖(保持比例)"
            value="contain"
          />
        </el-select>
      </el-form-item>
    </template>
  </el-form>
</template>

<style scoped>

</style>
