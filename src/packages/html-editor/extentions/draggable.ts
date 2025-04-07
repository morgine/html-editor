import type { ElementObject } from '@/packages/html-editor/object.ts'
import Hammer from 'hammerjs'

declare module '../object' {
  interface ElementEvents {
    'object:moving': {
      target: ElementObject
      x: number
      y: number
      offsetX: number
      offsetY: number
    }
    'object:moveStart': {
      target: ElementObject
    }
    'object:moveEnd': {
      target: ElementObject
    }
  }
}

export interface Options {
  isTranslate: boolean // 是否平移
  isDetectionParentCollision: boolean // 是否检测父元素碰撞
}

export function useDraggable(dragEl: HTMLElement, obj: ElementObject, options?: Partial<Options>) {
  options = {
    isDetectionParentCollision: true,
    isTranslate: false,
    ...options,
  }
  dragEl.style.cursor = options.isTranslate ? 'grab' : 'move'
  let isEditing = false
  let isTouching = false
  obj.on('object:editing', ({editing}) => {
    isEditing = editing
  })

  dragEl.addEventListener('touchstart', (e) => {
    e.stopPropagation()
    isTouching = true
  })
  dragEl.addEventListener('touchend', (e) => {
    isTouching = false
  })

  dragEl.addEventListener('mousedown', (e) => {
    e.stopPropagation()
    isTouching = true
    if (options.isTranslate) {
      dragEl.style.cursor = 'grabbing'
    }
  })

  dragEl.addEventListener('mouseup', (e) => {
    isTouching = false
    if (options.isTranslate) {
      dragEl.style.cursor = 'grab'
    }
  })

  const hammer: HammerManager = new Hammer(dragEl, {
    touchAction: 'none',
    recognizers: [
      // 启用捏合手势识别器 (Pinch)
      [Hammer.Pan, { enable: true }],
    ]
  });
  let startX = 0
  let startY = 0
  let startTranslateX = 0
  let startTranslateY = 0
  hammer.on('panstart', (e) => {
    if (isEditing || !isTouching) return
    startX = obj.x
    startY = obj.y
    startTranslateX = obj.translateX
    startTranslateY = obj.translateY
    if (!options.isTranslate) {
      obj.emit('object:moveStart', {
        target: obj,
      })
    }
  })
  hammer.on('panmove', (e) => {
    if (isEditing || !isTouching) return
    const dx = e.deltaX / (obj.parent?.scaleX || 1);
    const dy = e.deltaY / (obj.parent?.scaleY || 1);

    // 方式1：使用 transform
    if (options.isTranslate) {
      obj.setRecords({
        translateX: startTranslateX + dx,
        translateY: startTranslateY + dy,
      })
    } else {
      let left = startX + dx
      let top = startY + dy
      // 父元素碰撞检测
      if (options.isDetectionParentCollision && obj.parent) {

        const relativeBounds = obj.getRelativeBounds()
        const minX = obj.x - relativeBounds.x
        const minY = obj.y - relativeBounds.y
        const maxX = obj.parent.width - relativeBounds.width + minX
        const maxY = obj.parent.height - relativeBounds.height + minY

        // 水平边界检测
        left = Math.min(left, maxX)
        left = Math.max(left, minX)
        // 垂直边界检测
        top = Math.min(top, maxY)
        top = Math.max(top, minY)
      }

      obj.setRecords({
        x: left,
        y: top,
      })
      obj.emit('object:moving', {
        target: obj,
        x: left,
        y: top,
        offsetX: e.deltaX,
        offsetY: e.deltaY,
      })
    }
  })
  hammer.on('panend', (e) => {
    if (isEditing || !isTouching) return
    if (!options.isTranslate) {
      obj.emit('object:moveEnd', {
        target: obj,
      })
    }
  })
}
