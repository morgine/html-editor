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
  isDetectionParentCollision: boolean // 是否检测父元素碰撞
}

export function useDraggable(obj: ElementObject, options?: Partial<Options>) {
  options = {
    isDetectionParentCollision: true,
    ...options,
  }
  const dragEl = obj.el
  dragEl.style.cursor = 'move'
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
  })

  dragEl.addEventListener('mouseup', (e) => {
    isTouching = false
  })

  const hammer: HammerManager = new Hammer(dragEl, {
    touchAction: 'none',
    recognizers: [
      [Hammer.Pan, { enable: true }],
    ]
  });
  let startPoint: DOMPoint
  let inverseMatrix: DOMMatrix | undefined = undefined
  hammer.on('panstart', (e) => {
    if (isEditing || !isTouching) return
    if (obj.parent) {
      const absMatrix = obj.parent.getAbsMatrix()
      inverseMatrix = absMatrix.inverse()
      startPoint = absMatrix.transformPoint(new DOMPoint(obj.x, obj.y))
    } else {
      inverseMatrix = undefined
      startPoint = new DOMPoint(obj.x, obj.y)
    }
    obj.emit('object:moveStart', {
      target: obj,
    })
  })
  hammer.on('panmove', (e) => {
    if (isEditing || !isTouching) return
    let x: number
    let y: number

    if (inverseMatrix) {
      const absPoint = new DOMPoint(startPoint.x + e.deltaX, startPoint.y + e.deltaY)
      // 计算相对位置
      const p = inverseMatrix.transformPoint(absPoint)
      x = p.x
      y = p.y
    } else {
      x = startPoint.x + e.deltaX
      y = startPoint.y + e.deltaY
    }

    // 父元素碰撞检测
    if (options.isDetectionParentCollision && obj.parent) {

      const relativeBounds = obj.getRelativeBounds()
      const minX = obj.x - relativeBounds.x
      const minY = obj.y - relativeBounds.y
      const maxX = obj.parent.width - relativeBounds.width + minX
      const maxY = obj.parent.height - relativeBounds.height + minY

      // 水平边界检测
      x = Math.min(x, maxX)
      x = Math.max(x, minX)
      // 垂直边界检测
      y = Math.min(y, maxY)
      y = Math.max(y, minY)
    }

    obj.setRecords({
      x: x,
      y: y,
    })
    obj.emit('object:moving', {
      target: obj,
      x: x,
      y: y,
      offsetX: e.deltaX,
      offsetY: e.deltaY,
    })
  })
  hammer.on('panend', (e) => {
    if (isEditing || !isTouching) return
    obj.emit('object:moveEnd', {
      target: obj,
    })
  })
}
