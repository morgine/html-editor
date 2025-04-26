import { ElementObject, type SerializeElementObject } from '@/packages/html-editor/object.ts'
import { useDraggable } from '@/packages/html-editor/extentions/draggable.ts'
import { useControl } from '@/packages/html-editor/extentions/control.ts'

// export type CoverType = 'font' | 'font-spine' | 'all'

export interface BookCoverOptions {
  // coverType: CoverType // 封面类型
  paddingTop: number // 上边距
  paddingBottom: number // 下边距
  paddingLeft: number // 左边距
  paddingRight: number // 右边距
  spineWidth: number // 书脊宽度
  coverBorderColor: string // 封面边框颜色
  coverBorderWidth: number // 封面边框宽度
  coverBorderStyle: string // 封面边框样式, solid-实线, dashed-虚线, dotted-点线
}

export class BookCoverWorkspace extends ElementObject {
  spineWidth: number
  coverWidth: number
  coverHeight: number
  coverBorderColor: string // 封面边框颜色
  coverBorderWidth: number // 封面边框宽度
  coverBorderStyle: string // 封面边框样式, solid-实线, dashed-虚线, dotted-点线

  frontCoverObj: ElementObject // 封面区域
  backCoverObj: ElementObject // 封底区域
  spineAreaObj: ElementObject // 书脊区域
  constructor(options: SerializeElementObject & BookCoverOptions) {
    options = {
      shape: 'book-cover-workspace',
      ...options,
      backgroundColor: '',
    }
    super(options)
    this.spineWidth = options.spineWidth
    this.coverWidth = (options.width! - options.spineWidth) / 2
    this.coverHeight = options.height!
    this.coverBorderColor = options.coverBorderColor
    this.coverBorderWidth = options.coverBorderWidth
    this.coverBorderStyle = options.coverBorderStyle
    this.frontCoverObj = this.setupFrontCoverAreaObject()
    this.backCoverObj = this.setupBackCoverAreaObject()
    this.spineAreaObj = this.setupSpineAreaObject()
    this.el.style.overflow = 'visible'
    this.el.className = 'book-cover-workspace'
  }
  add(obj: ElementObject) {
    super.add(obj)
    useDraggable(obj, {
      isDetectionParentCollision: true, // 是否检测父元素碰撞
    })
  }

  private createHeaderEl(coverEl: HTMLElement, header: string) {
    const headerEl = document.createElement('div')
    headerEl.innerText = header
    headerEl.style.position = 'absolute'
    headerEl.style.top = '-20px'
    headerEl.style.color = '#888888'
    headerEl.style.fontSize = '14px'
    coverEl.style.display = 'flex'
    coverEl.style.justifyContent = 'center'
    coverEl.appendChild(headerEl)
  }

  private setupFrontCoverAreaObject() {
    if (!this.frontCoverObj) {
      this.frontCoverObj = new ElementObject()
      this.frontCoverObj.el.style.overflow = 'visible'
      this.createHeaderEl(this.frontCoverObj.el, '封面')
      super.add(this.frontCoverObj)
    }

    this.frontCoverObj.setRecords({
      x: this.coverWidth + this.spineWidth,
      y: 0,
      width: this.coverWidth,
      height: this.coverHeight,
    })
    this.frontCoverObj.el.style.borderWidth = `${this.coverBorderWidth}px`
    this.frontCoverObj.el.style.borderColor = this.coverBorderColor
    this.frontCoverObj.el.style.borderStyle = this.coverBorderStyle
    return this.frontCoverObj
  }

  private setupBackCoverAreaObject() {
    if (!this.backCoverObj) {
      this.backCoverObj = new ElementObject()
      this.backCoverObj.el.style.overflow = 'visible'
      this.createHeaderEl(this.backCoverObj.el, '封底')
      super.add(this.backCoverObj)
    }
    this.backCoverObj.setRecords({
      x: 0,
      y: 0,
      width: this.coverWidth,
      height: this.coverHeight,
    })
    this.backCoverObj.el.style.borderWidth = `${this.coverBorderWidth}px`
    this.backCoverObj.el.style.borderColor = this.coverBorderColor
    this.backCoverObj.el.style.borderStyle = this.coverBorderStyle
    return this.backCoverObj
  }

  private setupSpineAreaObject() {
    if (!this.spineAreaObj) {
      this.spineAreaObj = new ElementObject()
      this.spineAreaObj.el.style.overflow = 'visible'
      this.createHeaderEl(this.spineAreaObj.el, '书脊')
      super.add(this.spineAreaObj)
    }

    this.spineAreaObj.setRecords({
      x: this.coverWidth,
      y: 0,
      width: this.spineWidth,
      height: this.coverHeight,
    })
    this.spineAreaObj.el.style.borderWidth = `${this.coverBorderWidth}px`
    this.spineAreaObj.el.style.borderColor = this.coverBorderColor
    this.spineAreaObj.el.style.borderStyle = this.coverBorderStyle
    return this.spineAreaObj
  }
}

export class BookCover extends ElementObject {
  workspace: ElementObject
  texturedAreaEl: HTMLElement // 纹理区域
  constructor(options?: SerializeElementObject & BookCoverOptions) {
    options = {
      tag: 'div',
      shape: 'book-cover',
      width: 800,
      height: 600,
      paddingTop: 20,
      backgroundColor: '#fff7e5',
      paddingBottom: 20,
      paddingLeft: 40,
      paddingRight: 20,
      spineWidth: 20,
      coverBorderColor: '#888888',
      coverBorderWidth: 1,
      coverBorderStyle: 'dashed',
      ...options,
    }
    super(options)
    const {x, y, width, height} = {
      x: options.paddingLeft,
      y: options.paddingTop,
      width: options.width! - options.paddingLeft - options.paddingRight,
      height: options.height! - options.paddingTop - options.paddingBottom,
    }
    this.workspace = new BookCoverWorkspace({
      ...options,
      x,
      y,
      width,
      height,
    })
    this.add(this.workspace)
    this.el.className = 'book-cover'
    this.texturedAreaEl = this.setupTexturedAreaEl()
  }

  private setupTexturedAreaEl() {
    if (!this.texturedAreaEl) {
      this.texturedAreaEl = document.createElement('div')
      this.texturedAreaEl.className = 'textured-area'
      this.el.prepend(this.texturedAreaEl)
    }
    this.texturedAreaEl.style.position = 'absolute'
    this.texturedAreaEl.style.width = `${this.width}px`
    this.texturedAreaEl.style.height = `${this.height}px`
    this.texturedAreaEl.style.backgroundImage = 'url(/images/cover-texture.svg)'
    this.texturedAreaEl.style.backgroundSize = 'contain'
    this.texturedAreaEl.style.backgroundRepeat = 'repeat'
    return this.texturedAreaEl
  }
}
