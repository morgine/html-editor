import { Geometry } from './geometry'

export interface ElementEvents {
  'applying:transform': {
    target: ElementObject
    matrix: DOMMatrix
  }

  'applying:transform-origin': {
    target: ElementObject
    originX: number
    originY: number
  }

  'applying:position': {
    target: ElementObject
    x: number
    y: number
  }

  'applying:size': {
    target: ElementObject
    width: number
    height: number
  }

  'applying:border': {
    target: ElementObject
    data: BorderAttributes
  }

  'applying:text': {
    target: ElementObject
    data: TextAttributes
  }

  'applying:image': {
    target: ElementObject
    data: ImageAttributes
  }

  'applying:box': {
    target: ElementObject
    data: BoxAttributes
  }
}

export interface GeometryAttributes {
  x: number
  y: number
  width: number
  height: number
  originX: number
  originY: number
  scaleX: number
  scaleY: number
  skewX: number
  skewY: number
  rotate: number
  translateX: number
  translateY: number
}

export interface BorderAttributes {
  borderWidth: number
  borderColor: string
  borderRadius: string
  borderStyle: string
}

export interface TextAttributes {
  innerText: string
  fontSize: number
  fontFamily: string
  fontWeight: string
  fontStyle: string
  textDecoration: string
  textAlign: string
  color: string
  lineHeight: number
  letterSpacing: number
  textShadow: string
  writingMode: string
}

export interface ImageAttributes {
  // 图片属性
  src: string
  objectFit: string
}

export interface BoxAttributes {
  background: string
  boxShadow: string
  opacity: number
}

export interface ElementObjectAttributes extends GeometryAttributes,
  BorderAttributes,
  TextAttributes,
  ImageAttributes,
  BoxAttributes {}

export type ElementObjectKey = keyof ElementObjectAttributes

export interface SerializeElementObject extends Partial<GeometryAttributes>,
  Partial<BorderAttributes>,
  Partial<TextAttributes>,
  Partial<ImageAttributes>,
  Partial<BoxAttributes> {
  tag?: string
  children?: SerializeElementObject[]
}

export class ElementObject extends Geometry<ElementEvents> implements ElementObjectAttributes {
  el: HTMLElement
  parent?: ElementObject = undefined
  children: ElementObject[] = []

  tag: string = 'div'

  // box 属性
  background: string = ''
  boxShadow: string = ''
  opacity: number = 1

  // 边框属性
  borderWidth: number = 0
  borderColor: string = '#000'
  borderRadius: string = ''
  borderStyle: string = 'solid'

  // 文本属性
  innerText: string = ''
  fontSize: number = 16
  fontFamily: string = 'Arial'
  fontWeight: string = 'normal'
  fontStyle: string = 'normal'
  textDecoration: string = 'none'
  textAlign: string = 'left'
  color: string = '#000'
  lineHeight: number = 1.2
  letterSpacing: number = 0
  textShadow: string = ''
  writingMode: string = 'horizontal-tb'

  // 图片属性
  src: string = ''
  objectFit: string = 'contain'

  constructor(serialize?: SerializeElementObject) {
    super()
    this.el = this.createElement(serialize?.tag || this.tag)
    if (serialize) {
      for (const [key, value] of Object.entries(serialize)) {
        if (key === 'children') {
          const children = value as SerializeElementObject[]
          children.forEach((child) => {
            const childObj = new ElementObject(child)
            this.add(childObj)
          })
        } else if (key === 'tag') {
          this.tag = value
        } else {
          this.set(key as ElementObjectKey, value, false)
        }
      }
    }
    this.applyAll()
  }

  private createElement(tag: string): HTMLElement {
    const el = document.createElement(tag)
    el.style.position = 'absolute' // 设置绝对定位
    el.style.transformOrigin = '0 0' // 设置变换原点
    el.style.display = 'inline-block' // 设置为行内块级元素
    el.style.touchAction = 'none' // 禁止触摸事件
    el.style.userSelect = 'none' // 禁止选中
    el.style.overflow = 'hidden' // 禁止溢出
    return el
  }

  /**
   * 添加子元素
   * @param obj
   */
  add(obj: ElementObject) {
    this.el.appendChild(obj.el)
    obj.parent = this
    this.children.push(obj)
    // 监听子元素的事件, 并转发给父元素
    obj.onEach((key, event, origin) => {
      if (origin === 'self' || origin === 'children') {
        this.emit(key, event, 'children')
      }
    })

    // obj.on('applying:transform', (event, origin) => {
    //   event.target
    // })

    // 监听父元素的事件, 并转发给子元素
    this.onEach((key, event, origin) => {
      if (origin === 'self' || origin === 'parent') {
        for (const child of this.children) {
          child.emit(key, event, 'parent')
        }
      }
    })
  }

  remove(obj: ElementObject) {
    const index = this.children.indexOf(obj)
    if (index !== -1) {
      this.el.removeChild(obj.el)
      obj.parent = undefined
      this.children.splice(index, 1)
      // 取消监听子元素的事件
      obj.clear()
    }
  }

  /**
   * 应用变换矩阵
   */
  applyTransform() {
    const m = this.getSelfMatrix()
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
    this.el.style.transformOrigin = `${this.originX}px ${this.originY}px`
    this.emit('applying:transform-origin', {
      target: this,
      originX: this.originX,
      originY: this.originY,
    })
  }

  /**
   * 应用位置
   */
  applyPosition() {
    this.el.style.left = `${this.x}px`
    this.el.style.top = `${this.y}px`
    this.emit('applying:position', {
      target: this,
      x: this.x,
      y: this.y,
    })
  }

  /**
   * 应用大小
   */
  applySize() {
    this.el.style.width = `${this.width}px`
    this.el.style.height = `${this.height}px`
    this.emit('applying:size', {
      target: this,
      width: this.width,
      height: this.height,
    })
  }

  /**
   * 应用边框
   */
  applyBorder() {
    this.el.style.borderWidth = `${this.borderWidth}px`
    this.el.style.borderColor = this.borderColor
    this.el.style.borderRadius = `${this.borderRadius}px`
    this.el.style.borderStyle = this.borderStyle
    this.emit('applying:border', {
      target: this,
      data: {
        borderWidth: this.borderWidth,
        borderColor: this.borderColor,
        borderRadius: this.borderRadius,
        borderStyle: this.borderStyle,
      },
    })
  }

  /**
   * 应用文本
   */
  applyText() {
    this.el.innerText = this.innerText
    this.el.style.fontSize = `${this.fontSize}px`
    this.el.style.fontFamily = this.fontFamily
    this.el.style.fontWeight = this.fontWeight
    this.el.style.fontStyle = this.fontStyle
    this.el.style.textDecoration = this.textDecoration
    this.el.style.textAlign = this.textAlign
    this.el.style.color = this.color
    this.el.style.lineHeight = `${this.lineHeight}`
    this.el.style.letterSpacing = `${this.letterSpacing}px`
    this.el.style.textShadow = this.textShadow
    this.el.style.writingMode = this.writingMode
    this.emit('applying:text', {
      target: this,
      data: {
        innerText: this.innerText,
        fontSize: this.fontSize,
        fontFamily: this.fontFamily,
        fontWeight: this.fontWeight,
        fontStyle: this.fontStyle,
        textDecoration: this.textDecoration,
        textAlign: this.textAlign,
        color: this.color,
        lineHeight: this.lineHeight,
        letterSpacing: this.letterSpacing,
        textShadow: this.textShadow,
        writingMode: this.writingMode,
      },
    })
  }

  /**
   * 应用图片
   */
  applyImage() {
    const el = this.el as HTMLImageElement
    el.src = this.src
    el.style.objectFit = this.objectFit
    this.emit('applying:image', {
      target: this,
      data: {
        src: this.src,
        objectFit: this.objectFit,
      },
    })
  }

  /**
   * 应用盒子属性
   */
  applyBox() {
    this.el.style.background = this.background
    this.el.style.boxShadow = this.boxShadow
    this.el.style.opacity = `${this.opacity}`
    this.emit('applying:box', {
      target: this,
      data: {
        background: this.background,
        boxShadow: this.boxShadow,
        opacity: this.opacity,
      },
    })
  }

  applyAll() {
    this.applyPosition()
    this.applySize()
    this.applyTransformOrigin()
    this.applyTransform()
    this.applyBorder()
    this.applyText()
    this.applyImage()
    this.applyBox()
  }

  set<K extends ElementObjectKey, V extends this[K]>(key: K, value: V, updateStyle=true) {
    this.setRecords({[key]: value} as Record<K, V>, updateStyle)
  }

  setRecords<K extends ElementObjectKey, V extends this[K]>(records: Record<K, V>, updateStyle=true) {
    let appliedPosition = false
    let appliedSize = false
    let appliedTransform = false
    let appliedTransformOrigin = false
    for (const [key, value] of Object.entries(records)) {
      const k = key as K
      this[k] = value as V
      if (!updateStyle) continue
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
    const relativePoint = this.getRelativePositionByOrigin(absPoint, originX, originY)
    this.setRecords({
      x: relativePoint.x,
      y: relativePoint.y,
    })
  }
}
