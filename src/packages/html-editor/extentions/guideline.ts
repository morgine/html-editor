import type { ElementObject } from '@/packages/html-editor/object'
import type { Coords } from '@/packages/html-editor/types'
import type { Workspace } from '@/packages/html-editor/extentions/workspace'
import { addCoordsOffset } from '@/packages/html-editor/matrix.ts'

const coordsKeys: (keyof Coords)[] = ['tl', 'tr', 'bl', 'br', 'cn']

export interface Options {
  lineWidth: number
  lineColor: string
  snapDistance: number
}

export class Guideline {
  ws: Workspace
  yLines: { x1: number; y1: number; x2: number; y2: number }[] = []
  xLines: { x1: number; y1: number; x2: number; y2: number }[] = []
  verticalLine: HTMLElement
  horizontalLine: HTMLElement
  options: Options = {
    lineWidth: 1,
    lineColor: 'green',
    snapDistance: 5,
  }

  constructor(ws: Workspace, options?: Partial<Options>) {
    this.ws = ws
    this.options = {
      ...this.options,
      ...options,
    }

    this.verticalLine = this.createGuidelineEl(true)
    this.horizontalLine = this.createGuidelineEl(false)
    ws.el.parentElement!.appendChild(this.verticalLine)
    ws.el.parentElement!.appendChild(this.horizontalLine)

    this.listenEvents()
  }

  private listenEvents() {
    const aCoordsItems: Coords[] = []
    this.ws.on('object:moveStart', (node: ElementObject) => {
      aCoordsItems.length = 0
      // for (const child of this.ws.children) {
      //   if (child !== node) {
      //     const aCoords = child.calcACoords()
      //     aCoordsItems.push(aCoords)
      //   }
      // }
      aCoordsItems.push(this.ws.calcACoords())
    })
    this.ws.on('object:moving', (node: ElementObject) => {
      this.clearGuidelines()
      const aCoords = node.calcACoords()

      let minOffsetX: number | undefined = undefined;
      let minOffsetY: number | undefined = undefined;

      for (const key of coordsKeys) {
        const point = aCoords[key]
        const snapPoint = this.getSnappedPoint(point, aCoordsItems);
        if (snapPoint) {
          if (snapPoint.offsetX !== undefined) {
            if (minOffsetX === undefined || Math.abs(snapPoint.offsetX) < Math.abs(minOffsetX)) {
              minOffsetX = snapPoint.offsetX
            }
          }
          if (snapPoint.offsetY !== undefined) {
            if (minOffsetY === undefined || Math.abs(snapPoint.offsetY) < Math.abs(minOffsetY)) {
              minOffsetY = snapPoint.offsetY
            }
          }
        }
      }
      if (minOffsetX !== undefined || minOffsetY !== undefined) {
        const snapX = minOffsetX !== undefined ? aCoords.tr.x - minOffsetX : aCoords.tr.x
        const snapY = minOffsetY !== undefined ? aCoords.tr.y - minOffsetY : aCoords.tr.y

        node.setPositionByOrigin(new DOMPoint(Math.round(snapX), Math.round(snapY)), node.width, 0)
        this.showLines()
      } else {
        this.hideVerticalLine()
        this.hideHorizontalLine()
      }
    })
    this.ws.on('object:moveEnd', (node: ElementObject) => {
      this.hideVerticalLine()
      this.hideHorizontalLine()
    })
  }

  private clearGuidelines() {
    this.xLines.length = 0
    this.yLines.length = 0
  }

  getSnappedPoint(point: DOMPoint, aCoordsItems: Coords[]): { x: number, y: number, offsetX: number, offsetY: number } | undefined {
    let snapX: number | undefined = undefined
    let snapY: number | undefined = undefined
    let minOffsetX: number | undefined = undefined
    let minOffsetY: number | undefined = undefined

    for (const item of aCoordsItems) {
      for (const key of coordsKeys) {
        const relativePoint = item[key]
        const offsetX = point.x - relativePoint.x
        if (Math.abs(offsetX) <= this.options.snapDistance) {
          // 找到距离 x 轴最近的点
          if (minOffsetX === undefined || Math.abs(offsetX) < Math.abs(minOffsetX)) {
            this.yLines = [
              { x1: relativePoint.x, y1: point.y, x2: relativePoint.x, y2: relativePoint.y },
            ]
            snapX = relativePoint.x
            minOffsetX = offsetX
          }
        }
        const offsetY = point.y - relativePoint.y
        // 检测 y 轴是否在对齐范围内
        if (Math.abs(offsetY) <= this.options.snapDistance) {
          // 找到距离 y 轴最近的点
          if (minOffsetY === undefined || Math.abs(offsetY) < Math.abs(minOffsetY)) {
            this.xLines = [
              { x1: point.x, y1: relativePoint.y, x2: relativePoint.x, y2: relativePoint.y },
            ]
            snapY = relativePoint.y
            minOffsetY = offsetY
          }
        }
      }
    }

    if (snapX !== undefined || snapY !== undefined) {
      return {
        x: snapX === undefined ? point.x : snapX,
        y: snapY === undefined ? point.y : snapY,
        offsetX: minOffsetX!,
        offsetY: minOffsetY!,
      }
    }
    return undefined
  }

  /**
   * 初始化垂直线/水平线
   * @private
   */
  private createGuidelineEl(isVertical: boolean) {
    const el: HTMLElement = document.createElement('div')
    el.className = 'guideline'
    el.style.position = 'absolute'
    el.style.display = 'none'
    el.style.borderStyle = 'solid'
    if (isVertical) {
      el.style.borderWidth = `0 0 0 ${this.options.lineWidth}px`
    } else {
      el.style.borderWidth = `${this.options.lineWidth}px 0 0 0`
    }
    el.style.borderColor = this.options.lineColor
    return el
  }

  /**
   * 显示垂直线
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   */
  private showVerticalLine(x1: number, y1: number, x2: number, y2: number) {
    if (x1 !== x2) {
      throw new Error('not a vertical line')
    }
    const top = Math.min(y1, y2)
    const height = Math.abs(y1 - y2)
    this.verticalLine.style.left = `${x1}px`
    this.verticalLine.style.top = `${top}px`
    this.verticalLine.style.height = `${height}px`
    this.verticalLine.style.display = 'block'
  }
  /**
   * 显示水平线
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   */
  private showHorizontalLine(x1: number, y1: number, x2: number, y2: number) {
    if (y1 !== y2) {
      throw new Error('not a horizontal line')
    }
    const left = Math.min(x1, x2)
    const width = Math.abs(x1 - x2)
    this.horizontalLine.style.left = `${left}px`
    this.horizontalLine.style.top = `${y1}px`
    this.horizontalLine.style.width = `${width}px`
    this.horizontalLine.style.display = 'block'
  }

  private showLines() {
    if (this.xLines.length) {
      const { x1, y1, x2, y2 } = this.xLines[0]
      this.showHorizontalLine(x1, y1, x2, y2)
    }

    if (this.yLines.length) {
      const { x1, y1, x2, y2 } = this.yLines[0]
      this.showVerticalLine(x1, y1, x2, y2)
    }
  }

  /**
   * 隐藏垂直线
   */
  private hideVerticalLine() {
    this.verticalLine.style.display = 'none'
  }

  /**
   * 隐藏水平线
   */
  private hideHorizontalLine() {
    this.horizontalLine.style.display = 'none'
  }
}

export function useGuideline(ws: Workspace) {
  return new Guideline(ws)
}
