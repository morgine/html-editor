import type { ElementObject } from '@/packages/html-editor/object.ts'
import Hammer from 'hammerjs'

declare module '../object' {
  interface ElementObjectEvents {
    'object:moving': ElementObject
    'object:moveStart': ElementObject
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
  obj.on('object:editing', (editing) => {
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
    startX = obj.left
    startY = obj.top
    startTranslateX = obj.translateX
    startTranslateY = obj.translateY
    obj.emit('object:moveStart', obj)
  })
  hammer.on('panmove', (e) => {
    if (isEditing || !isTouching) return
    const dx = e.deltaX / (obj.parent?.scaleX || 1);
    const dy = e.deltaY / (obj.parent?.scaleY || 1);

    // 方式1：使用 transform
    if (options.isTranslate) {
      obj.set('translateX', startTranslateX + dx)
      obj.set('translateY', startTranslateY + dy)
      obj.updateTransformStyle()
    } else {
      let left = startX + dx
      let top = startY + dy
      //       // 父元素碰撞检测
      if (options.isDetectionParentCollision) {
        const parent = dragEl.parentElement
        if (parent) {
          // 水平边界检测
          const parentWidth = parent.offsetWidth
          const parentHeight = parent.offsetHeight
          const elementWidth = dragEl.offsetWidth
          const elementHeight = dragEl.offsetHeight
          const maxLeft = parentWidth - (elementWidth * obj.scaleX)
          left = Math.min(left, maxLeft)
          left = Math.max(left, 0)
          // 垂直边界检测
          const maxTop =parentHeight - (elementHeight * obj.scaleY)
          top = Math.min(top, maxTop)
          top = Math.max(top, 0)
        }
      }

      obj.set('left', left)
      obj.set('top', top)
      obj.emit('object:moving', obj, true)
    }
  })
}
