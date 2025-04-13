import { ElementObject, type SerializeElementObject } from '@/packages/html-editor/object.ts'
import { useEditable } from '@/packages/html-editor/extentions/editable.ts'

export class Text extends ElementObject {
  constructor(options?: SerializeElementObject) {
    options = {
      tag: 'div',
      innerText: 'Text',
      fontSize: 16,
      color: '#000',
      x: 0,
      y: 0,
      ...options,
    }
    super(options)
    this.el.className = 'text'
    this.el.style.width = 'fit-content'
    this.el.style.height = 'fit-content'
    useEditable(this)

    // 监听元素大小变化, 重新计算宽高
    const resizeObserver = new ResizeObserver(() => {
      this.calcWidthHeight()
    })
    resizeObserver.observe(this.el)
  }

  calcWidthHeight() {
    this.width = this.el.offsetWidth
    this.height = this.el.offsetHeight
  }
}
