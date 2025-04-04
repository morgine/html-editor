import type { ElementObject } from '../object'

export interface Options {
  margin: number
  offsetX: number
  offsetY: number
}

export class AutoResize {
  watchEl: HTMLElement
  obj: ElementObject
  options: Options = {
    margin: 0.05,
    offsetX: 0,
    offsetY: 0,
  }

  constructor(watchEl: HTMLElement, obj: ElementObject, options?: Partial<Options>) {
    this.options = { ...this.options, ...options }
    this.watchEl = watchEl
    this.obj = obj
    this.resize()
  }

  resize = () => {
    const obj = this.obj

    // 获取画布元素的实际位置
    const rect = this.watchEl.getBoundingClientRect();
    let { width: pWidth, height: pHeight } = rect;
    pWidth -= this.options.offsetX
    pHeight -= this.options.offsetY
    const { width: eWidth, height: eHeight } = obj;
    const scaleX = (pWidth - pWidth * this.options.margin) / eWidth;
    const scaleY = (pHeight - pHeight * this.options.margin) / eHeight;
    const scale = Math.min(scaleX, scaleY);

    const translateX = (pWidth - eWidth * scale) / 2 + this.options.offsetX;
    const translateY = (pHeight - eHeight * scale) / 2 + this.options.offsetY;

    obj.el.style.transition = 'transform 0.3s'
    obj.set('scaleX', scale);
    obj.set('scaleY', scale);
    obj.set('translateX', translateX);
    obj.set('translateY', translateY);
    obj.updateTransformStyle()
    setTimeout(() => {
      obj.el.style.transition = ''
    }, 300)
  }
}

export function useAutoResize(watchEl: HTMLElement, obj: ElementObject, options?: Partial<Options>) {
  return new AutoResize(watchEl, obj, options)
}
