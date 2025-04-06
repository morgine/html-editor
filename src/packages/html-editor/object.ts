import type { Coords } from './types'
import { getCoordBounds, transformCoords } from './matrix'
import { Geometry } from './geometry'

export type ElementObjectKey = keyof ElementObject

export interface ElementObjectEvents {
  'update:key': ElementObjectKey | ElementObjectKey[]
}

export interface SerializeElementObject {
  // 元素标签
  tag?: string

  // 子元素
  children?: SerializeElementObject[]

  // 基础属性
  width?: number
  height?: number
  x?: number
  y?: number
  background?: string

  // 变换属性
  originX?: number
  originY?: number
  translateX?: number
  translateY?: number
  angle?: number
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

export class GeoObject extends Geometry {
  tag: string = 'div'
  readonly el: HTMLElement
  parent?: GeoObject = undefined
  children: GeoObject[] = []

  background: string = ''

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

  private _nextTickHandle: number | null = null

  constructor(serialize: SerializeElementObject) {
    super()
    this.el = this.createElement(serialize.tag || this.tag)
    for (const [key, value] of Object.entries(serialize)) {
      if (key === 'children') {
        const children = value as SerializeElementObject[]
        children.forEach((child) => {
          const childObj = new GeoObject(child)
          this.add(childObj)
        })
      } else if (key === 'tag') {
        this.tag = value
      } else {
        this.set(key as ElementObjectKey, value)
      }
    }
    // this.matrix = this.calcMatrix()
  }

  private createElement(tag: string): HTMLElement {
    const el = document.createElement(tag)
    el.style.position = 'absolute' // 设置绝对定位
    el.style.transformOrigin = 'left top' // 设置变换原点
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
  add(obj: GeoObject) {
    this.el.appendChild(obj.el)
    obj.parent = this
    this.children.push(obj)
  }
}

export class ElementObject extends Geometry {
  tag: string = 'div'
  readonly el: HTMLElement
  parent?: ElementObject = undefined
  children: ElementObject[] = []

  // 基础属性
  x: number = 0
  y: number = 0
  width: number = 0
  height: number = 0
  // 坐标原点
  originX: number = 0
  originY: number = 0
  // 变换属性
  translateX: number = 0
  translateY: number = 0
  angle: number = 0
  skewY: number = 0
  skewX: number = 0
  scaleX: number = 1
  scaleY: number = 1

  background: string = ''

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

  private _nextTickHandle: number | null = null

  constructor(serialize: SerializeElementObject) {
    super()
    this.parent = undefined
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
    // this.matrix = this.calcMatrix()
  }

  nextTick(callback: () => void) {
    if (this._nextTickHandle) {
      cancelAnimationFrame(this._nextTickHandle)
    }
    this._nextTickHandle = requestAnimationFrame(() => {
      callback()
      this._nextTickHandle = null
    })
  }

  set<K extends keyof ElementObject>(key: K, value: this[K]) {
    this[key] = value
    switch (key) {
      case 'x':
        this.el.style.left = `${value}px`
        break
      case 'y':
        this.el.style.top = `${value}px`
        break
      case 'width':
        this.el.style.width = `${value}px`
        break
      case 'height':
        this.el.style.height = `${value}px`
        break
      case 'background':
        this.el.style.background = this.background
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
    }
    if (ElementObject.transformKeys.has(key)) {
      this.nextTick(this.updateMatrix.bind(this))
    }
    this.emit('update:key', key)
  }

  setRecords<K extends keyof ElementObject>(records: Record<K, this[K]>) {
    for (const [key, value] of Object.entries(records)) {
      this.set(key as K, value as this[K])
    }
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
  public emit<Key extends keyof ElementObjectEvents>(
    type: Key,
    args: ElementObjectEvents[Key],
    propagation = false,
  ): void {
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
      x: this.x,
      y: this.y,
      background: this.background,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      angle: this.angle,
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

  private getLocalCoords(margin: number = 0): Coords {
    return {
      tl: new DOMPoint(-margin, -margin),
      tr: new DOMPoint(this.width + margin, -margin),
      bl: new DOMPoint(-margin, this.height + margin),
      br: new DOMPoint(this.width + margin, this.height + margin),
      cn: new DOMPoint(this.width / 2, this.height / 2),
    }
  }

  /**
   * 计算相对包围盒坐标
   */
  public calcOCoords(margin: number = 0): Coords {
    const lc = this.getLocalCoords(margin)
    const positionMatrix = new DOMMatrix()
    positionMatrix.translateSelf(this.x, this.y)
    const matrix = positionMatrix.multiply(this.calcMatrix())
    return transformCoords(matrix, lc)
  }

  /**
   * 计算绝对包围盒坐标
   */
  public calcACoords(margin: number = 0): Coords {
    const lc = this.getLocalCoords(margin)
    const matrix = this.getAbsMatrix(true)
    return transformCoords(matrix, lc)
  }

  /**
   * 获取累积绝对变换矩阵
   * @param calc_position 是否计算坐标位置, 计算包围盒时需要加上位置, 计算逆矩阵时不需要
   */
  getAbsMatrix(calc_position:boolean=false): DOMMatrix {
    // 当前元素的变换矩阵（已处理origin）
    let matrix = this.calcMatrix();
    if (calc_position) {
      // 将x和y作为位移加入矩阵
      const positionMatrix = new DOMMatrix().translateSelf(this.x, this.y);
      matrix = positionMatrix.multiply(matrix);
    }
    if (this.parent) {
      // 父级绝对矩阵乘当前矩阵
      return this.parent.getAbsMatrix(true).multiply(matrix);
    } else {
      return matrix;
    }
  }


  // 获取相对包围盒
  getRelativeBounds(margin: number = 0): DOMRect {
    const coords = this.calcOCoords(margin)
    return getCoordBounds(coords)
  }

  // 获取绝对包围盒
  getAbsoluteBounds(margin: number = 0): DOMRect {
    const coords = this.calcACoords(margin)
    return getCoordBounds(coords)
  }

  setPositionByOrigin(abs: DOMPoint, originX: number, originY: number) {
    const absMatrix = this.getAbsMatrix(false)
    const inverseMatrix = absMatrix.inverse()
    const relativePoint = inverseMatrix.transformPoint(abs)
    const position = this.translateToGivenOrigin(relativePoint, originX, originY, this.originX, this.originY)
    this.setRecords({
      x: position.x,
      y: position.y,
    })
  }

  getCenterPoint(): DOMPoint {
    const aCoords = this.calcACoords()
    return aCoords.cn
  }

  getRelativeCenterPoint(): DOMPoint {
    const oCoords = this.calcOCoords()
    return oCoords.cn
  }

  /**
   * 将坐标从一个原点转换到另一个原点
   * @param point
   * @param fromOriginX
   * @param fromOriginY
   * @param toOriginX
   * @param toOriginY
   */
  translateToGivenOrigin(
    point: DOMPoint,
    fromOriginX: number,
    fromOriginY: number,
    toOriginX: number,
    toOriginY: number,
  ): DOMPoint {
    const m = new DOMMatrix();
    // 正确顺序：按右乘顺序构建矩阵（从右到左调用）
    m.translateSelf(toOriginX, toOriginY); // 最后一步：移动到新原点
    m.translateSelf(this.translateX, this.translateY); // 应用用户平移
    m.rotateSelf(this.angle); // 旋转
    m.skewYSelf(this.skewY);
    m.skewXSelf(this.skewX);
    m.scaleSelf(this.scaleX, this.scaleY); // 缩放
    m.translateSelf(-fromOriginX, -fromOriginY); // 第一步：平移到原原点
    return m.transformPoint(point);
  }
}
