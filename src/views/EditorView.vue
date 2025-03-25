<script setup lang="ts">
import { Rank } from '@element-plus/icons-vue'
import { useTemplateRef, onMounted, ref, watch } from 'vue'
import { Editor } from '@/packages/html-editor/editor.ts'
import { useWorkspace } from '@/packages/html-editor/extentions/workspace.ts'
import { useZoom } from '@/packages/html-editor/extentions/zoom.ts'
import { useRuler } from '@/packages/html-editor/extentions/ruler.ts'
import { useGrab, Grab } from '@/packages/html-editor/extentions/grap.ts'
import { Rect } from '@/packages/html-editor/shapes/rect.ts'
import { Text } from '@/packages/html-editor/shapes/text.ts'

const editorEl = useTemplateRef('editorEl')
const isGrabbing = ref(false)
const editor = ref<Editor>()
const grab = ref<Grab>()
watch(isGrabbing, v => {
  grab.value?.setEnabled(v)
})
onMounted(() => {
  const e = new Editor(editorEl.value!)
  const ws = useWorkspace(e)
  useZoom(editorEl.value!, ws)
  useRuler(editorEl.value!, ws)
  grab.value = useGrab(editorEl.value!, ws)
  editor.value = e
  const rect = new Rect({
    width: 100,
    height: 100,
  })
  rect.set('isParentCollisionDetection', true)
  rect.set('transform', [2, 0, 0, 2, 0, 0])
  const text = new Text()
  text.set('isParentCollisionDetection', true)
  ws.add(rect)
  ws.add(text)
})
</script>

<template>
  <div
    class="editor-container w-full h-screen"
    ref="editorEl"
    @keydown.space="isGrabbing=!isGrabbing"
    tabindex="0"
  >

    <div class="tool-box">
            <div>
              <el-button
                :type="isGrabbing?'primary':''"
                @click="isGrabbing=!isGrabbing"
                style="padding: 8px"
              >
                <el-icon color="none"><Rank /></el-icon>
              </el-button>
            </div>
    </div>
  </div>
</template>

<style>
</style>
<style scoped>

.editor-container{
  overflow: auto;
  position: relative;
  --offsetX: 0px;
  --offsetY: 0px;
  --size: 16px;
  --color: #dedcdc;
  background-image: -webkit-linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0), -webkit-linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
  background-image: linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0), linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
  background-position: var(--offsetX) var(--offsetY), calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
  background-size: calc(var(--size)* 2) calc(var(--size)* 2);
}
.tool-box {
  position: absolute;
  right: 22px;
  bottom: 22px;
  display: flex;
  align-items: center;
}
</style>

