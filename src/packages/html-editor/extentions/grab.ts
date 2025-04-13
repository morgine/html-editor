import type { ElementObject } from '@/packages/html-editor/object.ts'
import Hammer from 'hammerjs'

export class Grab {
  private modalElement: HTMLElement
  private targetObject: ElementObject
  private hammer: HammerManager

  constructor(grabContainer: HTMLElement, targetObject: ElementObject) {
    this.modalElement = this.createModalElement()
    grabContainer.appendChild(this.modalElement)
    this.targetObject = targetObject
    this.hammer = new Hammer(this.modalElement , {
      touchAction: 'none',
      recognizers: [
        [Hammer.Pan, { enable: true }],
      ]
    });
    this.listenEvents()
  }

  private createModalElement(): HTMLElement {
    const modal = document.createElement('div')
    modal.style.position = 'absolute'
    modal.style.left = '0'
    modal.style.top = '0'
    modal.style.width = '100%'
    modal.style.height = '100%'
    modal.style.zIndex = '999'
    modal.style.cursor = 'grab'
    modal.style.display = 'none'
    return modal
  }

  setGrab(isGrabbing: boolean) {
    if (isGrabbing) {
      this.modalElement.style.display = 'block'
    } else {
      this.modalElement.style.display = 'none'
    }
  }

  private listenEvents() {
    let startX: number = 0
    let startY: number = 0
    this.modalElement.addEventListener('mousedown', (e) => {
      this.modalElement.style.cursor = 'grabbing'
    })
    this.modalElement.addEventListener('mouseup', (e) => {
      this.modalElement.style.cursor = 'grab'
    })
    this.hammer.on('panstart', (e) => {
      startX = this.targetObject.translateX
      startY = this.targetObject.translateY
    })
    this.hammer.on('panmove', (e) => {
      const dx = e.deltaX
      const dy = e.deltaY
      this.targetObject.setRecords({
        translateX: startX + dx,
        translateY: startY + dy,
      })
    })
  }
}
