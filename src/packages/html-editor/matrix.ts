import type { Coords } from '@/packages/html-editor/types'

/**
 * 根据变换矩阵和包围盒顶点坐标计算变换后的包围盒顶点坐标
 * @param matrix 变换矩阵
 * @param coords 包围盒顶点坐标
 */
export function transformCoords(matrix: DOMMatrix, coords: Coords): Coords {
  return {
    tl: matrix.transformPoint(coords.tl),
    tr: matrix.transformPoint(coords.tr),
    bl: matrix.transformPoint(coords.bl),
    br: matrix.transformPoint(coords.br),
    cn: matrix.transformPoint(coords.cn),
  }
}

/**
 * 给定点坐标添加偏移量
 * @param p 点坐标
 * @param offset 偏移量
 */
export function addPointOffset(p: DOMPoint, offset: DOMPoint): DOMPoint {
  const np = new DOMPoint(p.x, p.y);
  np.x += offset.x;
  np.y  += offset.y;
  return np
}

/**
 * 给定包围盒顶点坐标添加偏移量
 * @param c 包围盒顶点坐标
 * @param offset 偏移量
 */
export function addCoordsOffset(c: Coords, offset: DOMPoint): Coords {
  return {
    tl: addPointOffset(c.tl, offset),
    tr: addPointOffset(c.tr, offset),
    bl: addPointOffset(c.bl, offset),
    br: addPointOffset(c.br, offset),
    cn: addPointOffset(c.cn, offset),
  }
}

/**
 * 计算两点之间的距离
 * @param p1 点1
 * @param p2 点2
 */
export function calcDistance(p1: DOMPoint, p2: DOMPoint): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

/**
 * 根据包围盒顶点坐标计算矩形包围盒
 * @param c 包围盒顶点坐标
 */
export function getCoordBounds(c: Coords): DOMRect {
  const minX = Math.min(c.tl.x, c.tr.x, c.bl.x, c.br.x)
  const minY = Math.min(c.tl.y, c.tr.y, c.bl.y, c.br.y)
  const maxX = Math.max(c.tl.x, c.tr.x, c.bl.x, c.br.x)
  const maxY = Math.max(c.tl.y, c.tr.y, c.bl.y, c.br.y)
  return new DOMRect(minX, minY, maxX - minX, maxY - minY)
}

export function getMultiplyCoordsBounds(cs: Coords[]): DOMRect {
  const minX = Math.min(...cs.map(c => Math.min(c.tl.x, c.tr.x, c.bl.x, c.br.x)))
  const minY = Math.min(...cs.map(c => Math.min(c.tl.y, c.tr.y, c.bl.y, c.br.y)))
  const maxX = Math.max(...cs.map(c => Math.max(c.tl.x, c.tr.x, c.bl.x, c.br.x)))
  const maxY = Math.max(...cs.map(c => Math.max(c.tl.y, c.tr.y, c.bl.y, c.br.y)))
  return new DOMRect(minX, minY, maxX - minX, maxY - minY)
}
