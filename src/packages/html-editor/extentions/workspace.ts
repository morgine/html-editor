import { ElementObject, type SerializeElementObject } from '../object'
import { AutoResize, useAutoResize } from '@/packages/html-editor/extentions/auto-resize.ts'
import { useZoom } from '@/packages/html-editor/extentions/zoom.ts'
import { useRuler } from '@/packages/html-editor/extentions/ruler.ts'
import { useDraggable } from '@/packages/html-editor/extentions/draggable.ts'
import { useControl } from '@/packages/html-editor/extentions/control.ts'
import { Grab } from '@/packages/html-editor/extentions/grab.ts'

declare module '../object' {
  interface ElementEvents {
    'object:active': {
      target: ElementObject | undefined
    }
  }
}

export interface Options {
  rulerSize?: number
}

export class Workspace extends ElementObject {
  autoResize: AutoResize
  grab: Grab
  active?: ElementObject

  constructor(editorEl: HTMLElement, options?: SerializeElementObject & Options) {
    options = {
      rulerSize: 16,
      tag: 'div',
      width: 500,
      height: 500,
      background: '#fff',
      ...options,
    }
    const { rulerSize, ...opts } = options
    super(opts)
    this.el.className = 'workspace'
    editorEl.prepend(this.el)
    this.autoResize = useAutoResize(editorEl, this, {
      margin: 0,
      offsetX: rulerSize,
      offsetY: rulerSize,
    })
    useZoom(editorEl, this, {
      listenWheel: true,
    })
    useRuler(editorEl, this, {
      size: rulerSize,
    })
    // useDraggable(editorEl, this, {
    //   isDetectionParentCollision: false, // 是否检测父元素碰撞
    // })
    // useControl(editorEl, this)
    this.grab = new Grab(editorEl, this)
  }

  serializeHtml(): string {
    const transform = this.el.style.transform
    this.el.style.transition = ''
    const html: string = new XMLSerializer().serializeToString(this.el)
    this.el.style.transform = transform
    return html
  }

  print(): void {
    const html = this.serializeHtml()
    const printWindow = window.open('', '_blank', `width=${this.width},height=${this.height}`)
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.print()
      // printWindow.close()
    }
  }

  add(obj: ElementObject): void {
    super.add(obj)
    this.listenClickEvent(obj)
  }

  listenClickEvent(obj: ElementObject) {
    let isMoving = false
    obj.on('object:moving', () => {
      isMoving = true
    })
    obj.el.addEventListener('mouseup', (e) => {
      if (isMoving) {
        isMoving = false
        return
      }
      e.stopPropagation()
      const activeElement: ElementObject | undefined = this.active === obj ? undefined : obj
      this.active = activeElement
      this.emit('object:active', {
        target: activeElement,
      })
    })
    for (const child of obj.children) {
      this.listenClickEvent(child)
    }
  }

  setActive(obj: ElementObject | undefined) {
    this.active = obj
    this.emit('object:active', {
      target: obj,
    })
  }
}
