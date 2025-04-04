import { TypedEmitter } from './event.ts'

export interface EditorEvents {
  dispose: undefined
}

export class Editor extends TypedEmitter<EditorEvents> {
  el: HTMLElement

  constructor(el: HTMLElement) {
    super()
    this.el = el
  }

  dispose(): void {
    this.emit('dispose', undefined)
  }
}
