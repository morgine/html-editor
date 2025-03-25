import { ElementObject } from '@/packages/html-editor/object.ts'

export interface Options {
  fontSize?: string;
  color?: string;
  left?: number;
  top?: number;
}

export class Text extends ElementObject {
  constructor(text: string = 'Text', options?: Options) {
    options = {
      fontSize: '16px',
      color: '#000',
      left: 0,
      top: 0,
      ...options,
    }
    const el = document.createElement('div')
    el.style.position = 'absolute'
    el.contentEditable = 'true'
    el.innerText = text
    super(el)
    for (const [key, value] of Object.entries(options)) {
      this.set(key as keyof Options, value)
    }
  }
}
