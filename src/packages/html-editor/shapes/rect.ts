import { ElementObject, type SerializeElementObject } from '@/packages/html-editor/object.ts'


export class Rect extends ElementObject {
  constructor(options?: SerializeElementObject) {
    options = {
      tag: 'div',
      shape: 'rect',
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
  }
}
