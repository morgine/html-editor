import type { ElementObject } from '../object'

export interface Options {
  minScale: number
  maxScale: number
}

export class Zoom {
  watchEl: HTMLElement
  zoomObject: ElementObject
  options: Options = {
    minScale: 0.2,
    maxScale: 5,
  }

  constructor(watchEl: HTMLElement, zoom: ElementObject, options?: Partial<Options>) {
    this.options = { ...this.options, ...options }
    this.watchEl = watchEl
    this.zoomObject = zoom
    this.listenEvent()
  }

  private listenEvent() {
    this.watchEl.addEventListener('wheel', this.handleWheel)
  }

  private handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    const scaleDelta = e.deltaY * 0.005
    const obj = this.zoomObject
    const scaleX = obj.transform[0] + scaleDelta
    const scaleY = obj.transform[3] + scaleDelta
    const newScaleX = Math.min(Math.max(scaleX, this.options.minScale), this.options.maxScale)
    const newScaleY = Math.min(Math.max(scaleY, this.options.minScale), this.options.maxScale)

    // 获取画布元素的实际位置
    const rect = this.watchEl.getBoundingClientRect();
    const elemLeft = rect.left;
    const elemTop = rect.top;

    // 计算鼠标在画布坐标系中的位置（考虑元素偏移）
    const mouseX = e.clientX - elemLeft;
    const mouseY = e.clientY - elemTop;

    // 计算新的平移值以保持鼠标位置不变
    const newTranslateX = mouseX - (mouseX - obj.transform[4]) * (newScaleX / obj.transform[0]);
    const newTranslateY = mouseY - (mouseY - obj.transform[5]) * (newScaleY / obj.transform[3]);

    obj.set('transform', [newScaleX, obj.transform[1], obj.transform[2], newScaleY, newTranslateX, newTranslateY])
  }
}

export function useZoom(watchEl: HTMLElement, zoom: ElementObject, options?: Partial<Options>) {
  return new Zoom(watchEl, zoom, options)
}
