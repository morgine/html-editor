import { ElementObject, type SerializeElementObject } from '@/packages/html-editor/object.ts'

export class Text extends ElementObject {
  constructor(options?: SerializeElementObject) {
    options = {
      tag: 'div',
      shape: 'text',
      innerText: 'Text',
      fontSize: 16,
      color: '#000000',
      fontFamily: 'Noto Sans SC',
      x: 0,
      y: 0,
      ...options,
    }
    super(options)
    this.el.className = 'text'
    this.el.style.width = 'fit-content'
    this.el.style.height = 'fit-content'
    // useEditable(this)

    // 监听元素大小变化, 重新计算宽高
    const resizeObserver = new ResizeObserver(() => {
      this.calcWidthHeight()
    })
    resizeObserver.observe(this.el)

    this.listenEvent()
  }

  calcWidthHeight() {
    this.width = this.el.offsetWidth
    this.height = this.el.offsetHeight
  }

  private listenEvent() {
    this.on('applying:text', () => {
      this.calcWidthHeight()
    })
  }
}
