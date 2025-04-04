import { TypedEmitter } from './event'
import type { Coords } from '@/packages/html-editor/types.ts'

export type ElementObjectKey = keyof ElementObject

export interface ElementObjectEvents {
  'update:key': ElementObjectKey
}

export interface SerializeElementObject {
  // 元素标签
  tag?: string

  // 子元素
  children?: SerializeElementObject[]

  // 基础属性
  width?: number
  height?: number
  left?: number
  top?: number
  background?: string

  // 变换属性
  translateX?: number
  translateY?: number
  rotate?: number
  skewY?: number
  skewX?: number
  scaleX?: number
  scaleY?: number

  // 边框属性
  borderWidth?: number
  borderColor?: string
  borderStyle?: string

  // 文本属性
  innerText?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  fontStyle?: string
  textDecoration?: string
  textAlign?: string
  color?: string
  lineHeight?: number
  letterSpacing?: number
  textShadow?: string
  writingMode?: string

  // 图片属性
  src?: string
  objectFit?: string
}

export class ElementObject extends TypedEmitter<ElementObjectEvents> {
  tag: string = 'div'
  el: HTMLElement
  parent: ElementObject | null = null
  children: ElementObject[] = []

  // 基础属性
  width: number = 0
  height: number = 0
  left: number = 0
  top: number = 0
  background: string = ''

  // 变换属性
  translateX: number = 0
  translateY: number = 0
  rotate: number = 0
  skewY: number = 0
  skewX: number = 0
  scaleX: number = 1
  scaleY: number = 1

  // 边框属性
  borderWidth: number = 0
  borderColor: string = '#000'
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

  // 相对包围盒坐标
  oCoords?: Coords
  // 绝对包围盒坐标
  aCoords?: Coords

  constructor(serialize: SerializeElementObject) {
    super()
    const el = document.createElement(serialize.tag || this.tag)
    el.style.position = 'absolute' // 设置绝对定位
    el.style.transformOrigin = 'left top' // 设置变换原点
    el.style.display = 'inline-block' // 设置为行内块级元素
    el.style.touchAction = 'none' // 禁止触摸事件
    el.style.userSelect = 'none' // 禁止选中
    el.style.overflow = 'hidden' // 禁止溢出
    this.el = el
    for (const [key, value] of Object.entries(serialize)) {
      if (key === 'children') {
        const children = value as SerializeElementObject[]
        children.forEach((child) => {
          const childObj = new ElementObject(child)
          childObj.parent = this
          this.add(childObj)
        })
      } else if (key === 'tag') {
        this.tag = value
      } else {
        this.set(key as ElementObjectKey, value)
      }
    }
  }

  private getTransformMatrix(): DOMMatrix {
    const matrix = new DOMMatrix()
    matrix.translateSelf(this.translateX, this.translateY)
    matrix.rotateSelf(0, 0, this.rotate)
    matrix.skewXSelf(this.skewX)
    matrix.skewYSelf(this.skewY)
    matrix.scaleSelf(this.scaleX, this.scaleY)
    return matrix
  }

  /**
   * 更新变换样式
   */
  updateTransformStyle() {
    const { a, b, c, d, e, f } = this.getTransformMatrix()
    this.el.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`
  }

  /**
   * 设置属性
   * @param key 属性名
   * @param value 属性值
   */
  public set<K extends keyof ElementObject>(key: K, value: this[K]): void {
    this[key] = value
    console.log('set', key, value)
    if (key) {
      switch (key) {
        case 'width':
          this.el.style.width = `${this.width}px`
          break
        case 'height':
          this.el.style.height = `${this.height}px`
          break
        case 'left':
          this.el.style.left = `${this.left}px`
          break
        case 'top':
          this.el.style.top = `${this.top}px`
          break
        case 'background':
          this.el.style.background = this.background
          break
        case 'scaleX':
          break
        case 'scaleY':
          break
        case 'rotate':
          break
        case 'skewX':
          break
        case 'skewY':
          break
        case 'translateX':
          break
        case 'translateY':
          break
        case 'borderWidth':
          this.el.style.borderWidth = `${this.borderWidth}px`
          break
        case 'borderColor':
          this.el.style.borderColor = this.borderColor
          break
        case 'borderStyle':
          this.el.style.borderStyle = this.borderStyle
          break
        case 'innerText':
          this.el.innerText = this.innerText
          break
        case 'fontSize':
          this.el.style.fontSize = `${this.fontSize}px`
          break
        case 'fontFamily':
          this.el.style.fontFamily = this.fontFamily
          break
        case 'fontWeight':
          this.el.style.fontWeight = this.fontWeight
          break
        case 'fontStyle':
          this.el.style.fontStyle = this.fontStyle
          break
        case 'textDecoration':
          this.el.style.textDecoration = this.textDecoration
          break
        case 'textAlign':
          this.el.style.textAlign = this.textAlign
          break
        case 'color':
          this.el.style.color = this.color
          break
        case 'lineHeight':
          this.el.style.lineHeight = `${this.lineHeight}px`
          break
        case 'letterSpacing':
          this.el.style.letterSpacing = `${this.letterSpacing}px`
          break
        case 'textShadow':
          this.el.style.textShadow = this.textShadow
          break
        case 'writingMode':
          this.el.style.writingMode = this.writingMode
          break
        case 'src':
          this.el.setAttribute('src', this.src)
          break
        case 'objectFit':
          this.el.style.objectFit = this.objectFit
          break
        default:
          throw new Error(`set: ${key} is not a valid key`)
      }
    }
    this.emit('update:key', key)
  }

  /**
   * 添加子元素
   * @param obj
   */
  public add(obj: ElementObject) {
    this.el.appendChild(obj.el)
    obj.parent = this
    this.children.push(obj)
  }

  /**
   * 触发对象事件
   * @param type 事件类型
   * @param args 事件参数
   * @param propagation 是否传播事件(传递给父元素)
   */
  public emit<Key extends keyof ElementObjectEvents>(type: Key, args: ElementObjectEvents[Key], propagation=false): void {
    super.emit(type, args)
    if (propagation) {
      this.parent?.emit(type, args, true)
    }
  }

  /**
   * 序列化对象
   */
  public serialize(): SerializeElementObject {
    return {
      tag: this.tag,
      children: this.children.map((child) => child.serialize()),
      width: this.width,
      height: this.height,
      left: this.left,
      top: this.top,
      background: this.background,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      rotate: this.rotate,
      skewX: this.skewX,
      skewY: this.skewY,
      translateX: this.translateX,
      translateY: this.translateY,
      borderWidth: this.borderWidth,
      borderColor: this.borderColor,
      borderStyle: this.borderStyle,
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
      src: this.src,
      objectFit: this.objectFit,
    }
  }

  /**
   * 计算相对包围盒坐标
   */
  public calcOCoords(): Coords {
    const { width, height, left, top } = this
    const c: Coords = {
      tl: {x: 0, y: 0},
      tr: {x: width, y: 0},
      bl: {x: 0, y: height},
      br: {x: width, y: height},
      cn: {x: width/2, y: height/2},
    }
    const matrix = this.getTransformMatrix()
    this.oCoords = {
      tl: matrix.transformPoint(c.tl),
      tr: matrix.transformPoint(c.tr),
      bl: matrix.transformPoint(c.bl),
      br: matrix.transformPoint(c.br),
      cn: matrix.transformPoint(c.cn),
    }
    return this.oCoords
  }

  /**
   * 获取相对包围盒坐标
   */
  public getOCoords(): Coords {
    if (!this.oCoords) {
      return this.calcOCoords()
    }
    return this.oCoords
  }

  /**
   * 计算绝对包围盒坐标
   */
  public calcACoords(): Coords {
    if (!this.parent) {
      const coords = this.calcOCoords()
      this.aCoords = {
        tl: {...coords.tl},
        tr: {...coords.tr},
        bl: {...coords.bl},
        br: {...coords.br},
        cn: {...coords.cn},
      }
      return this.aCoords
    } else {

    }
  }
}
