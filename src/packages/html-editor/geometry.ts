import type { Coords } from './types'
import { getCoordBounds, transformCoords } from './matrix'
import { EventEmitter } from '@/packages/html-editor/mitter.ts'


export class Geometry<Events extends Record<keyof Events, unknown>> extends EventEmitter<Events> {
  declare parent?: Geometry<Events>
  x: number = 0
  y: number = 0
  width: number = 0
  height: number = 0
  originX: number = 0
  originY: number = 0
  scaleX: number = 1
  scaleY: number = 1
  skewX: number = 0
  skewY: number = 0
  rotate: number = 0
  translateX: number = 0
  translateY: number = 0

  /**
   * 获取当前元素的变换矩阵
   */
  getSelfMatrix(): DOMMatrix {
    const m = new DOMMatrix()
    // 应用变换
    m.translateSelf(this.translateX, this.translateY)
    m.rotateSelf(this.rotate)
    m.skewYSelf(this.skewY)
    m.skewXSelf(this.skewX)
    m.scaleSelf(this.scaleX, this.scaleY)
    return m
  }

  getLocalCoords(margin: number = 0): Coords {
    return {
      tl: new DOMPoint(-margin, -margin),
      tr: new DOMPoint(this.width + margin, -margin),
      bl: new DOMPoint(-margin, this.height + margin),
      br: new DOMPoint(this.width + margin, this.height + margin),
      cn: new DOMPoint(this.width / 2, this.height / 2),
    }
  }

  /**
   * 计算相对包围盒坐标
   * @param margin 边距
   */
  calcOCoords(margin: number = 0): Coords {
    const lc = this.getLocalCoords(margin)
    const positionMatrix = new DOMMatrix()
    positionMatrix.translateSelf(this.x, this.y)
    const matrix = positionMatrix.multiply(this.getSelfMatrix())
    return transformCoords(matrix, lc)
  }

  /**
   * 计算绝对包围盒坐标
   * @param margin 边距
   */
  calcACoords(margin: number = 0): Coords {
    const lc = this.getLocalCoords(margin)
    const matrix = this.getAbsMatrix(true)
    return transformCoords(matrix, lc)
  }

  /**
   * 获取累积绝对变换矩阵
   * @param calcPosition 是否计算坐标位置, 计算包围盒时需要加上位置, 计算逆矩阵时不需要
   */
  getAbsMatrix(calcPosition: boolean = false): DOMMatrix {
    // 当前元素的变换矩阵
    let matrix = this.getSelfMatrix()
    if (calcPosition) {
      // 将x和y作为位移加入矩阵
      const positionMatrix = new DOMMatrix().translateSelf(this.x, this.y)
      matrix = positionMatrix.multiply(matrix)
    }
    const parent = this.parent
    if (parent) {
      // 父级绝对矩阵乘当前矩阵
      return parent.getAbsMatrix(true).multiply(matrix)
    } else {
      return matrix
    }
  }

  /**
   * 计算相对包围盒坐标
   * @param margin 边距
   */
  calcRelativeBounds(margin: number = 0): DOMRect {
    const coords = this.calcOCoords(margin)
    return getCoordBounds(coords)
  }

  /**
   * 计算绝对包围盒坐标
   * @param margin 边距
   */
  calcAbsoluteBounds(margin: number = 0): DOMRect {
    const coords = this.calcACoords(margin)
    return getCoordBounds(coords)
  }

  /**
   * 将一个点从一个原点坐标系转换到另一个原点坐标系
   * @param point 转换的点
   * @param fromOriginX 原点坐标系的原点X坐标
   * @param fromOriginY 原点坐标系的原点Y坐标
   * @param toOriginX 目标坐标系的原点X坐标
   * @param toOriginY 目标坐标系的原点Y坐标
   */
  translateToGivenOrigin(
    point: DOMPoint,
    fromOriginX: number,
    fromOriginY: number,
    toOriginX: number,
    toOriginY: number,
  ): DOMPoint {
    const m = new DOMMatrix()
    // 正确顺序：按右乘顺序构建矩阵（从右到左调用）
    m.translateSelf(toOriginX, toOriginY) // 最后一步：移动到新原点
    m.translateSelf(this.translateX, this.translateY) // 应用用户平移
    m.rotateSelf(this.rotate) // 旋转
    m.skewYSelf(this.skewY)
    m.skewXSelf(this.skewX)
    m.scaleSelf(this.scaleX, this.scaleY) // 缩放
    m.translateSelf(-fromOriginX, -fromOriginY) // 第一步：平移到原原点
    return m.transformPoint(point)
  }

  getRelativePosition(absPoint: DOMPoint): DOMPoint {
    // if (!this.parent) {
    //   return absPoint
    // }
    const absMatrix = this.getAbsMatrix(false)
    const inverseMatrix = absMatrix.inverse()
    return inverseMatrix.transformPoint(absPoint)
  }

  /**
   * 根据绝对坐标点和原点坐标计算相对坐标
   * @param absPoint 绝对坐标
   * @param originX 原点X坐标
   * @param originY 原点Y坐标
   * @return point 相对坐标
   */
  getRelativePositionByOrigin(absPoint: DOMPoint, originX: number, originY: number): DOMPoint {
    const relativePoint = this.getRelativePosition(absPoint)
    return this.translateToGivenOrigin(relativePoint, originX, originY, this.originX, this.originY)
  }

  // 获取相对包围盒
  getRelativeBounds(margin: number = 0): DOMRect {
    const coords = this.calcOCoords(margin)
    return getCoordBounds(coords)
  }

  // 获取绝对包围盒
  getAbsoluteBounds(margin: number = 0): DOMRect {
    const coords = this.calcACoords(margin)
    return getCoordBounds(coords)
  }
}
