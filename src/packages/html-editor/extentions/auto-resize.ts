import type { ElementObject } from '../object'
import { animate } from '@/packages/html-editor/animation.ts'

declare module '../object' {
  interface ElementObjectEvents {
    'object:moving': ElementObject
    'object:moveStart': ElementObject
    'object:moveEnd': ElementObject
  }
}

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
    const rect = this.watchEl.getBoundingClientRect()
    let { width: pWidth, height: pHeight } = rect
    pWidth -= this.options.offsetX
    pHeight -= this.options.offsetY
    const { width: eWidth, height: eHeight } = obj
    const scaleX = (pWidth - pWidth * this.options.margin) / eWidth
    const scaleY = (pHeight - pHeight * this.options.margin) / eHeight
    const scale = Math.min(scaleX, scaleY)

    const translateX = (pWidth - eWidth * scale) / 2 + this.options.offsetX
    const translateY = (pHeight - eHeight * scale) / 2 + this.options.offsetY
    // obj.setRecords({
    //   scaleX: scale,
    //   scaleY: scale,
    //   translateX,
    //   translateY,
    // })
    // obj.updateTransformStyle()
    animate(
      [obj.scaleX, obj.scaleY, obj.translateX, obj.translateY],
      [scale, scale, translateX, translateY],
      (value: number[], progress: number) => {
        if (progress < 1) {
          obj.setRecords({
            scaleX: value[0],
            scaleY: value[1],
            translateX: value[2],
            translateY: value[3],
          })
        } else {
          obj.setRecords({
            scaleX: scale,
            scaleY: scale,
            translateX,
            translateY,
          })
        }
        // obj.updateTransformStyle()
      },
      {
        duration: 300,
      }
    )
  }
}

export function useAutoResize(
  watchEl: HTMLElement,
  obj: ElementObject,
  options?: Partial<Options>,
) {
  return new AutoResize(watchEl, obj, options)
}
