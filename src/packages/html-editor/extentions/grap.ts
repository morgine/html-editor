import type { ElementObject } from '@/packages/html-editor/object.ts'


export class Grab {
  watchEl: HTMLElement
  transformObject: ElementObject
  private isGraping = false
  private enabled = false

  constructor(watchEl: HTMLElement, transformObject: ElementObject) {
    this.watchEl = watchEl
    this.transformObject = transformObject
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (enabled) {
      this.watchEl.style.cursor = 'grab'
      this.listenEvents()
    } else {
      this.watchEl.style.cursor = 'default'
      this.offEvents()
    }
  }

  private listenEvents = () => {
    this.watchEl.addEventListener('mousedown', this.handleMouseDown, true)
    this.watchEl.addEventListener('mousemove', this.handleMouseMove)
    this.watchEl.addEventListener('mouseup', this.handleMouseUp)
  }

  private offEvents = () => {
    this.watchEl.removeEventListener('mousedown', this.handleMouseDown)
    this.watchEl.removeEventListener('mousemove', this.handleMouseMove)
    this.watchEl.removeEventListener('mouseup', this.handleMouseUp)
  }

  private handleMouseDown = (e: MouseEvent) => {
    if (!this.enabled) return
    e.stopPropagation()
    this.isGraping = true
    this.watchEl.style.cursor = 'grabbing'
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isGraping) return
    const ws = this.transformObject
    const x = ws.transform[4] + e.movementX
    const y = ws.transform[5] + e.movementY
    ws.set('transform', [ws.transform[0], ws.transform[1], ws.transform[2], ws.transform[3], x, y])
  }

  private handleMouseUp = (e: MouseEvent) => {
    this.isGraping = false
    this.watchEl.style.cursor = 'grab'
  }
}

export function useGrab(watchEl: HTMLElement, transformObject: ElementObject) {
  return new Grab(watchEl, transformObject)
}
