import { ElementObject, type SerializeElementObject } from '@/packages/html-editor/object.ts'
import { useEditable } from '@/packages/html-editor/extentions/editable.ts'
import { useDraggable } from '@/packages/html-editor/extentions/draggable.ts'

export class Text extends ElementObject {
  constructor(options?: SerializeElementObject) {
    options = {
      tag: 'div',
      innerText: 'Text',
      fontSize: 16,
      color: '#000',
      left: 0,
      top: 0,
      ...options,
    }
    super(options)
    this.el.className = 'text'
    this.el.style.width = 'fit-content'
    this.el.style.height = 'fit-content'
    useEditable(this)
    useDraggable(this.el, this, {
      isTranslate: false, // 是否平移
      isDetectionParentCollision: true // 是否检测父元素碰撞
    })
  }
}
