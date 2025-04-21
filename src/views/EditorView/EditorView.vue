<script setup lang="ts">
import { FullScreen, Printer, Rank } from '@element-plus/icons-vue'
import { useTemplateRef, onMounted, ref, computed, watch } from 'vue'
import { Workspace } from '@/packages/html-editor/extentions/workspace.ts'
import { useZoom } from '@/packages/html-editor/extentions/zoom.ts'
import { Rect } from '@/packages/html-editor/shapes/rect.ts'
import { Text } from '@/packages/html-editor/shapes/text.ts'
import { Image } from '@/packages/html-editor/shapes/image.ts'
import { useGuideline } from '@/packages/html-editor/extentions/guideline.ts'
import { ElementObject } from '@/packages/html-editor/object.ts'
import TextAttrBox from '@/views/EditorView/components/TextAttrBox.vue'
import { BookCover } from '@/packages/html-editor/shapes/book-cover.ts'
import BackgroundBox from '@/views/EditorView/components/BackgroundBox.vue'

const editorEl = useTemplateRef('editorEl')
const active = ref<ElementObject | undefined>(undefined)
const isGrabbing = ref(false)
const drawer = ref(false)
const workspace = ref<Workspace>()
const bookCover = new BookCover()

const workspaceRef = ref({
  translateX: 0,
  translateY: 0,
})

onMounted(() => {
  if (!editorEl.value) {
    throw new Error('editorEl is not defined')
  }
  const ws = new Workspace(editorEl.value, {
    width: bookCover.width,
    height: bookCover.height,
  })
  // useGuideline(ws)
  const title = new Text({
    writingMode: 'horizontal-tb',
    fontWeight: 'bold',
    fontSize: 20,
    innerText: `《春暮》`
  })
  const text1 = new Text({
    writingMode: 'horizontal-tb',
    innerText: `春江烟柳绿参差，戏水新雏碎玉池。
莫怨东风逐香冷，梨花一夜满青枝。`
  })
  const text2 = new Text({
    innerText: '黄河之水天上来',
    writingMode: 'vertical-rl',
    fontSize: 12,
    fontWeight: 'light',
  })
  // const img = new Image({
  //   src: 'https://lingfeng-temu3.oss-cn-beijing.aliyuncs.com/resources/DzUhiblq9FMKdLUfps0Md8pmnziFKZOxs7uHyN9zTOJapCWMn1t0kvg0sr0OqubAUs0CnAMn7dQ8ZffZiy8QBgOHr40zY5PVIgfr',
  //   width: 100,
  //   height: 100,
  // })
  bookCover.workspace.add(title)
  bookCover.workspace.add(text1)
  bookCover.workspace.add(text2)
  ws.add(bookCover)
  useGuideline(bookCover.workspace, {
    lineColor: '#ff7272',
  })

  ws.on('applying:transform', () => {
      workspaceRef.value.translateX = ws.translateX
      workspaceRef.value.translateY = ws.translateY
  })

  ws.on('object:active', (e) => {
    console.log('active', e)
    active.value = e.target
    if (e.target) {
      drawer.value = true
    } else {
      drawer.value = false
    }
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
  <el-drawer
    v-model="drawer"
    direction="btt"
    :with-header="false"
    size="60%"
    :before-close="() => workspace?.setActive(undefined)"
  >
    <el-scrollbar class="p-4">
      <template v-if="active">
        <template v-if="active.shape === 'text'">
          <TextAttrBox :active="active as Text"></TextAttrBox>
        </template>
        <template v-else>
          <BackgroundBox :obj="bookCover"></BackgroundBox>
        </template>
      </template>
    </el-scrollbar>
  </el-drawer>
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

