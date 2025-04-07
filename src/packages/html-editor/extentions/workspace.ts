import { Editor } from '../editor'
import { ElementObject, type SerializeElementObject } from '../object'
import { AutoResize, useAutoResize } from '@/packages/html-editor/extentions/auto-resize.ts'
import { useZoom } from '@/packages/html-editor/extentions/zoom.ts'
import { useRuler } from '@/packages/html-editor/extentions/ruler.ts'
import { useDraggable } from '@/packages/html-editor/extentions/draggable.ts'
import { useControl } from '@/packages/html-editor/extentions/control.ts'

declare module '../editor' {
  interface Editor {
    workspace: Workspace
  }
}

export interface Options {
  rulerSize: number
}

export class Workspace extends ElementObject {
  autoResize: AutoResize

  constructor(editor: Editor, options?: SerializeElementObject & Options) {
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
    editor.el.prepend(this.el)
    editor.workspace = this
    this.autoResize = useAutoResize(editor.el, this, {
      margin: 0,
      offsetX: rulerSize,
      offsetY: rulerSize,
    })
    useZoom(editor.el, this, {
      listenWheel: true,
    })
    useRuler(editor.el, this, {
      size: rulerSize,
    })
    useDraggable(editor.el, this, {
      isTranslate: true, // 是否平移
      isDetectionParentCollision: false, // 是否检测父元素碰撞
    })
    useControl(editor.el, this)
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
}
