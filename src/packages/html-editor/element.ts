import { Geometry } from '@/packages/html-editor/geometry.ts'
import { TypedEmitter } from '@/packages/html-editor/event.ts'

export interface ObjectEvents {
  'applying:transform': {
    target: BaseObject
    matrix: DOMMatrix
  }

  'applying:transform-origin': {
    target: BaseObject
    originX: number
    originY: number
  }

  'applying:position': {
    target: BaseObject
    x: number
    y: number
  }

  'applying:size': {
    target: BaseObject
    width: number
    height: number
  }
}

export class BaseObject extends TypedEmitter<ObjectEvents> {
  el: HTMLElement
  parent?: BaseObject
  children: BaseObject[]
  geo: Geometry

  /**
   * 应用变换矩阵
   */
  applyTransform() {
    const m = this.geo.getSelfMatrix()
    this.el.style.transform = m.toString()
    this.emit('applying:transform', {
      target: this,
      matrix: m,
    })
  }

  /**
   * 应用变换原点
   */
  applyTransformOrigin() {
    this.el.style.transformOrigin = `${this.geo.originX}px ${this.geo.originY}px`
    this.emit('applying:transform-origin', {
      target: this,
      originX: this.geo.originX,
      originY: this.geo.originY,
    })
  }

  /**
   * 应用位置
   */
  applyPosition() {
    this.el.style.left = `${this.geo.x}px`
    this.el.style.top = `${this.geo.y}px`
    this.emit('applying:position', {
      target: this,
      x: this.geo.x,
      y: this.geo.y,
    })
  }

  /**
   * 应用大小
   */
  applySize() {
    this.el.style.width = `${this.geo.width}px`
    this.el.style.height = `${this.geo.height}px`
    this.emit('applying:size', {
      target: this,
      width: this.geo.width,
      height: this.geo.height,
    })
  }

  applyAll() {
    this.applyPosition()
    this.applySize()
    this.applyTransformOrigin()
    this.applyTransform()
  }

  setGeometry<K extends keyof Geometry, V extends Geometry[K]>(key: K, value: V) {
    this.geo[key] = value
    switch (key) {
      case 'x':
      case 'y':
        this.applyPosition()
        break
      case 'width':
      case 'height':
        this.applySize()
        break
      case 'originX':
      case 'originY':
        this.applyTransformOrigin()
        break
      case 'scaleX':
      case 'scaleY':
      case 'skewX':
      case 'skewY':
      case 'rotate':
      case 'translateX':
      case 'translateY':
        this.applyTransform()
        break
    }
  }

  setGeometryRecords<K extends keyof Geometry, V extends Geometry[K]>(records: Record<K, V>) {
    let appliedPosition = false
    let appliedSize = false
    let appliedTransform = false
    let appliedTransformOrigin = false
    for (const [key, value] of Object.entries(records)) {
      const k = key as K
      this.geo[k] = value as V
      switch (k) {
        case 'x':
        case 'y':
          appliedPosition = true
          break
        case 'width':
        case 'height':
          appliedSize = true
          break
        case 'originX':
        case 'originY':
          appliedTransformOrigin = true
          break
        case 'scaleX':
        case 'scaleY':
        case 'skewX':
        case 'skewY':
        case 'rotate':
        case 'translateX':
        case 'translateY':
          appliedTransform = true
          break
      }
    }

    if (appliedPosition) {
      this.applyPosition()
    }
    if (appliedSize) {
      this.applySize()
    }
    if (appliedTransform) {
      this.applyTransform()
    }
    if (appliedTransformOrigin) {
      this.applyTransformOrigin()
    }
  }

  setPositionByOrigin(absPoint: DOMPoint, originX: number, originY: number) {
    const relativePoint = this.geo.getRelativePositionByOrigin(absPoint, originX, originY)
    this.setGeometryRecords({
      x: relativePoint.x,
      y: relativePoint.y,
    })
  }
}
