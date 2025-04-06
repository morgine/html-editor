import { ElementObject, type SerializeElementObject } from '@/packages/html-editor/object.ts'
import { useDraggable } from '@/packages/html-editor/extentions/draggable.ts'

export class Rect extends ElementObject {
  constructor(options?: SerializeElementObject) {
    options = {
      tag: 'div',
      width: 100,
      height: 100,
      background: 'transparent',
      borderWidth: 1,
      borderColor: '#000',
      borderStyle: 'solid',
      ...options,
    }
    super(options)
    this.el.className = 'rect'
    useDraggable(this.el, this, {
      isTranslate: false, // 是否平移
      isDetectionParentCollision: true // 是否检测父元素碰撞
    })
  }
}
