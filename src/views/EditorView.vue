<script setup lang="ts">
import { FullScreen, Printer } from '@element-plus/icons-vue'
import { useTemplateRef, onMounted, ref } from 'vue'
import { Editor } from '@/packages/html-editor/editor.ts'
import { Workspace } from '@/packages/html-editor/extentions/workspace.ts'
import { useZoom } from '@/packages/html-editor/extentions/zoom.ts'
import { Rect } from '@/packages/html-editor/shapes/rect.ts'
import { Text } from '@/packages/html-editor/shapes/text.ts'
import { Image } from '@/packages/html-editor/shapes/image.ts'

const editorEl = useTemplateRef('editorEl')
const isGrabbing = ref(false)
const editor = ref<Editor>()
const wrokspace = ref<Workspace>()
onMounted(() => {
  const e = new Editor(editorEl.value!)
  wrokspace.value = new Workspace(e)
  editor.value = e
  const rect = new Rect({
    width: 100,
    height: 100,
  })
  useZoom(rect.el, rect)
  const text = new Text({writingMode: 'vertical-rl'})
  const text2 = new Text({
    innerText: '竖排文本, Hello World',
    writingMode: 'vertical-rl'
  })
  const img = new Image({
    src: 'https://lingfeng-temu3.oss-cn-beijing.aliyuncs.com/resources/DzUhiblq9FMKdLUfps0Md8pmnziFKZOxs7uHyN9zTOJapCWMn1t0kvg0sr0OqubAUs0CnAMn7dQ8ZffZiy8QBgOHr40zY5PVIgfr',
    width: 100,
    height: 100,
  })
  wrokspace.value.add(rect)
  wrokspace.value.add(text)
  wrokspace.value.add(text2)
  wrokspace.value.add(img)
})
</script>

<template>
  <div
    class="editor-container w-screen h-screen"
    ref="editorEl"
    @keydown.space="isGrabbing=!isGrabbing"
    tabindex="0"
  >

    <div class="tool-box">
      <div>
        <el-button
          @click="wrokspace?.autoResize.resize()"
          style="padding: 8px"
        >
          <el-icon color="none"><FullScreen /></el-icon>
        </el-button>
      </div>
      <div>
        <el-button
          @click="wrokspace?.print()"
          style="padding: 8px"
        >
          <el-icon color="none"><Printer /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<style>
</style>
<style scoped>

.editor-container{
  overflow: hidden;
  position: relative;
  --offsetX: 0px;
  --offsetY: 0px;
  --size: 16px;
  --color: #dedcdc;
  touch-action: none;
  user-select: none;
  background-image: -webkit-linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0), -webkit-linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
  background-image: linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0), linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
  background-position: var(--offsetX) var(--offsetY), calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
  background-size: calc(var(--size)* 2) calc(var(--size)* 2);
}
.tool-box {
  position: absolute;
  right: 22px;
  top: 22px;
  display: flex;
  align-items: center;
}
</style>

