import { ElementObject, type SerializeElementObject } from '@/packages/html-editor/object.ts'

export class Image extends ElementObject {
  constructor(options: SerializeElementObject & {src: string, width: number, height: number}) {
    options = {
      objectFit: 'contain',
      ...options,
      tag: 'img',
    }
    super(options)
    this.el.className = 'img'
  }
}
