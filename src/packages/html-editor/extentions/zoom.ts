import type { ElementObject } from '../object'
import Hammer from 'hammerjs'

export interface Options {
  minScale: number
  maxScale: number
  listenWheel?: boolean
}

export class Zoom {
  watchEl: HTMLElement
  zoomObject: ElementObject
  hammer: HammerManager
  options: Options = {
    minScale: 0.2,
    maxScale: 5,
    listenWheel: false
  }
  private startScale = 1;
  private isTouching = false

  constructor(watchEl: HTMLElement, zoom: ElementObject, options?: Partial<Options>) {
    this.options = { ...this.options, ...options }
    this.watchEl = watchEl
    this.zoomObject = zoom
    this.hammer = new Hammer(watchEl, {
      touchAction: 'none',
      recognizers: [
        // 启用捏合手势识别器 (Pinch)
        [Hammer.Pinch, { enable: true }],
      ]
    });
    this.listenEvent()
  }

  private listenEvent() {
    if (this.options.listenWheel) {
      this.watchEl.addEventListener('wheel', this.handleWheel)
    }
    this.watchEl.addEventListener('touchstart', (e) => {
      e.stopPropagation()
      this.isTouching = true
    })
    this.watchEl.addEventListener('touchend', (e) => {
      this.isTouching = false
    })
    this.hammer.on('pinchstart pinchmove', (e) => {
      if (e.type === 'pinchstart') {
        this.startScale = this.zoomObject.scaleX;
        return
      }
      if (!this.isTouching) return
      // 计算新的缩放比例（基于初始值）
      let newScale = this.startScale * e.scale;
      newScale = Math.min(newScale, this.options.maxScale);
      newScale = Math.max(newScale, this.options.minScale);
      const obj = this.zoomObject
      obj.set('scaleX', newScale)
      obj.set('scaleY', newScale)
      obj.updateTransformStyle()
    });
  }

  private handleWheel = (e: WheelEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const obj = this.zoomObject
    let scale = obj.scaleX
    scale *= 0.999 ** e.deltaY
    const newScale = Math.min(Math.max(scale, this.options.minScale), this.options.maxScale)
    // 获取画布元素的实际位置
    const rect = this.watchEl.getBoundingClientRect();
    const elemLeft = rect.left;
    const elemTop = rect.top;

    // 计算鼠标在画布坐标系中的位置（考虑元素偏移）
    const mouseX = e.clientX - elemLeft;
    const mouseY = e.clientY - elemTop;

    // 计算新的平移值以保持鼠标位置不变
    const newTranslateX = mouseX - (mouseX - obj.translateX) * (newScale / obj.scaleX);
    const newTranslateY = mouseY - (mouseY - obj.translateY) * (newScale / obj.scaleY);
    obj.set('scaleX', newScale)
    obj.set('scaleY', newScale)
    obj.set('translateX', newTranslateX);
    obj.set('translateY', newTranslateY);
    obj.updateTransformStyle()
  }
}

export function useZoom(watchEl: HTMLElement, zoom: ElementObject, options?: Partial<Options>) {
  return new Zoom(watchEl, zoom, options)
}
