<script setup lang="ts">
import { FullScreen, Printer, Rank } from '@element-plus/icons-vue'
import { useTemplateRef, onMounted, ref, computed, watch } from 'vue'
import { Workspace } from '@/packages/html-editor/extentions/workspace.ts'
import { useZoom } from '@/packages/html-editor/extentions/zoom.ts'
import { Rect } from '@/packages/html-editor/shapes/rect.ts'
import { Text } from '@/packages/html-editor/shapes/text.ts'
import { Image } from '@/packages/html-editor/shapes/image.ts'
import { useControl } from '@/packages/html-editor/extentions/control.ts'
import { useGuideline } from '@/packages/html-editor/extentions/guideline.ts'

const editorEl = useTemplateRef('editorEl')
const isGrabbing = ref(false)
const params = ref({
  x: 0,
  y: 0,
  originX: 0,
  originY: 0,
})
const workspace = ref<Workspace>()
const rect = new Rect({
  width: 100,
  height: 100,
  x: 100,
  y: 100,
  rotate: 10,
})

const rectRef = ref({
  x: rect.x,
  y: rect.y,
  width: rect.width,
  height: rect.height,
})

const workspaceRef = ref({
  translateX: 0,
  translateY: 0,
})

rect.on('applying:transform', () => {
    rectRef.value.x = rect.x
    rectRef.value.y = rect.y
    rectRef.value.width = rect.width
    rectRef.value.height = rect.height
})

const setPositionByOrigin = () => {
  const {x, y, originX, originY} = params.value
  rect.setPositionByOrigin(new DOMPoint(x, y), originX, originY)
}
onMounted(() => {
  if (!editorEl.value) {
    throw new Error('editorEl is not defined')
  }
  const ws = new Workspace(editorEl.value)
  // rect.updateTransformStyle()
  useControl(editorEl.value, rect)
  // useControl(ws.el, rect, {position: 'relative'})
  useZoom(rect.el, rect)
  useGuideline(ws)
  const text = new Text({writingMode: 'vertical-rl'})
  const text2 = new Text({
    innerText: '竖排文本, Hello World',
    writingMode: 'vertical-rl',
    // angle: 20
  })
  // const img = new Image({
  //   src: 'https://lingfeng-temu3.oss-cn-beijing.aliyuncs.com/resources/DzUhiblq9FMKdLUfps0Md8pmnziFKZOxs7uHyN9zTOJapCWMn1t0kvg0sr0OqubAUs0CnAMn7dQ8ZffZiy8QBgOHr40zY5PVIgfr',
  //   width: 100,
  //   height: 100,
  // })
  ws.add(rect)
  ws.add(text)
  ws.add(text2)
  // workspace.value.add(img)

  ws.on('applying:transform', () => {
      workspaceRef.value.translateX = ws.translateX
      workspaceRef.value.translateY = ws.translateY
  })

  workspace.value = ws
})
</script>

<template>
  <div
    class="editor-container w-full h-screen"
    ref="editorEl"
    @keydown.space="isGrabbing=!isGrabbing"
    tabindex="0"
  >

    <div class="tool-box" @click.stop="void 0">
      <div>
        <el-button
          @click="workspace?.autoResize.resize()"
          style="padding: 8px"
        >
          <el-icon color="none"><FullScreen /></el-icon>
        </el-button>
      </div>
      <div>
        <el-button
          @click="() => {
            isGrabbing = !isGrabbing
            workspace?.grab.setGrab(isGrabbing)
          }"
          :type="isGrabbing?'primary':'default'"
          style="padding: 8px"
        >
          <el-icon color="none"><Rank /></el-icon>
        </el-button>
      </div>
      <div>
        <el-button
          @click="workspace?.print()"
          style="padding: 8px"
        >
          <el-icon color="none"><Printer /></el-icon>
        </el-button>
      </div>
<!--      <div>-->
<!--        <el-form size="small" label-width="100px" label-position="right">-->
<!--          <el-form-item label="x">-->
<!--            <el-input-number-->
<!--              v-model="params.x"-->
<!--              @change="setPositionByOrigin()"-->
<!--              style="width: 100px"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="y">-->
<!--            <el-input-number-->
<!--              v-model="params.y"-->
<!--              @change="setPositionByOrigin()"-->
<!--              style="width: 100px"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="originX">-->
<!--            <el-input-number-->
<!--              v-model="params.originX"-->
<!--              @change="setPositionByOrigin()"-->
<!--              style="width: 100px"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="originY">-->
<!--            <el-input-number-->
<!--              v-model="params.originY"-->
<!--              @change="setPositionByOrigin()"-->
<!--              style="width: 100px"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </div>-->
<!--      <div>-->
<!--        <el-form size="small" label-width="100px" label-position="right">-->
<!--          <el-form-item label="x">-->
<!--            <el-input-number-->
<!--              :model-value="rectRef.x"-->
<!--              style="width: 100px"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="y">-->
<!--            <el-input-number-->
<!--              :model-value="rectRef.y"-->
<!--              style="width: 100px"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="width">-->
<!--            <el-input-number-->
<!--              :model-value="rectRef.width"-->
<!--              style="width: 100px"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="height">-->
<!--            <el-input-number-->
<!--              :model-value="rectRef.height"-->
<!--              style="width: 100px"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </div>-->
<!--      <div>-->
<!--        <el-form size="small" label-width="100px" label-position="right">-->
<!--          <el-form-item label="translateX">-->
<!--            <el-input-number-->
<!--              :model-value="workspaceRef.translateX"-->
<!--              style="width: 100px"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="translateY">-->
<!--            <el-input-number-->
<!--              :model-value="workspaceRef.translateY"-->
<!--              style="width: 100px"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </div>-->
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
  z-index: 9999;
}
</style>

