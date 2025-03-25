import { ElementObject } from '@/packages/html-editor/object.ts'

export interface Options {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  background?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
}

export class Rect extends ElementObject {
  constructor(options: Options) {
    options = {
      width: 100,
      height: 100,
      left: 0,
      top: 0,
      background: 'transparent',
      borderWidth: '1px',
      borderColor: '#000',
      borderStyle: 'solid',
      ...options,
    }
    const el = document.createElement('div')
    el.style.position = 'absolute'
    super(el)
    for (const [key, value] of Object.entries(options)) {
      this.set(key as keyof Options, value)
    }
  }
}
