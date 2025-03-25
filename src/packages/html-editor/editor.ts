import { TypedEmitter } from './event.ts'

export type EditorEvents = {
  dispose: void
}

export class Editor extends TypedEmitter<EditorEvents> {
  el: HTMLElement

  constructor(el: HTMLElement) {
    super()
    this.el = el
  }

  dispose(): void {
    this.emit('dispose')
  }
}
