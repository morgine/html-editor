import { ElementObject, type SerializeElementObject } from '@/packages/html-editor/object.ts'
import { useDraggable } from '@/packages/html-editor/extentions/draggable.ts'

export class Image extends ElementObject {
  constructor(options: SerializeElementObject & {src: string, width: number, height: number}) {
    options = {
      objectFit: 'contain',
      ...options,
      tag: 'img',
    }
    super(options)
    this.el.className = 'img'
    useDraggable(this.el, this, {
      isTranslate: false, // 是否平移
      isDetectionParentCollision: true // 是否检测父元素碰撞
    })
  }
}
