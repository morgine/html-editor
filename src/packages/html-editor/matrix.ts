import type { TMatrix2D, Point } from './types'

export const transformPoint = (p: Point, t: TMatrix2D, ignoreOffset = false): Point => {
  return {
    x: t[0] * p.x + t[2] * p.y + (ignoreOffset ? 0 : t[4]),
    y: t[1] * p.x + t[3] * p.y + (ignoreOffset ? 0 : t[5]),
  };
}

export const invertTransform = (t: TMatrix2D): TMatrix2D => {
  const a = 1 / (t[0] * t[3] - t[1] * t[2]),
    r = [a * t[3], -a * t[1], -a * t[2], a * t[0], 0, 0] as TMatrix2D,
    { x, y } = transformPoint({x: t[4], y: t[5]}, t, true);
  r[4] = -x;
  r[5] = -y;
  return r;
};
