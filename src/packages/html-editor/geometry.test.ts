import { describe, expect, test, beforeEach } from 'vitest';
import { Geometry } from './geometry'; // 根据实际路径调整

interface MockEvents {
 key: string;
}

class MockObject extends Geometry<MockEvents> {}

describe('Geometry', () => {
  let geometry: MockObject;
  let parentGeometry: MockObject;

  beforeEach(() => {
    // 初始化基本Geometry实例
    geometry = new MockObject();
    geometry.width = 100;
    geometry.height = 50;

    // 初始化父元素
    parentGeometry = new Geometry();
    parentGeometry.width = 100;
    parentGeometry.height = 50;
    geometry.parent = parentGeometry;
  });

  describe('calcOCoords', () => {
    test('should calculate coordinates without transformations', () => {
      const coords = geometry.calcOCoords();
      expect(coords.tl).toEqual(new DOMPoint(0, 0));
      expect(coords.tr).toEqual(new DOMPoint(100, 0));
      expect(coords.bl).toEqual(new DOMPoint(0, 50));
      expect(coords.br).toEqual(new DOMPoint(100, 50));
    });

    test('should apply translation', () => {
      geometry.x = 10;
      geometry.y = 20;
      const coords = geometry.calcOCoords();
      expect(coords.tl.x).toBe(10);
      expect(coords.tl.y).toBe(20);
    });

    test('should apply scaling', () => {
      geometry.scaleX = 2;
      geometry.scaleY = 3;
      const coords = geometry.calcOCoords();
      expect(coords.tr.x).toBe(200); // 100 * 2
      expect(coords.br.y).toBe(150); // 50 * 3
    });

    test('should apply rotation', () => {
      geometry.rotate = 90;
      const coords = geometry.calcOCoords();
      // 旋转90度后右上角坐标应变为 (0, 100)
      expect(coords.tr.x).toBeCloseTo(0, 4);
      expect(coords.tr.y).toBeCloseTo(100, 4);
    });

    test('should apply margin', () => {
      const coords = geometry.calcOCoords(10);
      expect(coords.tl.x).toBe(-10);
      expect(coords.tr.y).toBe(-10);
    });
  });

  describe('calcACoords', () => {
    test('should match OCoords when no parent', () => {
      const oCoords = geometry.calcOCoords();
      const aCoords = geometry.calcACoords();
      expect(aCoords.tl.x).toBe(oCoords.tl.x);
      expect(aCoords.br.y).toBe(oCoords.br.y);
    });

    test('should include parent transformations', () => {
      parentGeometry.x = 50;
      parentGeometry.scaleX = 2;
      geometry.x = 10;

      const aCoords = geometry.calcACoords();
      // 父位移50 + 子位移10 * 父缩放2
      expect(aCoords.tl.x).toBe(70); // 50 + 10 * 2
      expect(aCoords.tr.x).toBe(270); // 50 + (10 + 100) * 2
    });
  });

  describe('calcRelativeBounds', () => {
    test('should calculate bounds with rotation', () => {
      geometry.rotate = 45;
      const bounds = geometry.calcRelativeBounds();
      const coords = geometry.calcOCoords();

      const minX = Math.min(...Object.values(coords).map(p => p.x));
      const maxX = Math.max(...Object.values(coords).map(p => p.x));
      expect(bounds.width).toBeCloseTo(maxX - minX, 4);
    });
  });

  describe('calcAbsoluteBounds', () => {
    test('should include parent scale in bounds', () => {
      parentGeometry.scaleX = 2;
      parentGeometry.scaleY = 2;
      geometry.width = 50;
      geometry.height = 25;

      const bounds = geometry.calcAbsoluteBounds();
      expect(bounds.width).toBe(100); // 50 * 2
      expect(bounds.height).toBe(50); // 25 * 2
    });

    test('should handle complex transformations', () => {
      parentGeometry.x = 100;
      parentGeometry.rotate = 90;
      geometry.x = 50;
      geometry.rotate = 45;

      const bounds = geometry.calcAbsoluteBounds();
      // 验证计算结果是否合理
      expect(bounds.x).toBeLessThan(Infinity);
      expect(bounds.width).toBeGreaterThan(0);
    });
  });

  describe('translateToGivenOrigin', () => {
    test('should handle without transform', () => {
      const point = new DOMPoint(10, 20);
      const result = geometry.translateToGivenOrigin(point, 5, 5, 30, 30);
      expect(result.x).toBe(35);
      expect(result.y).toBe(45);
    });

    test('should handle scale transform', () => {
      geometry.scaleX = 2;
      geometry.scaleY = 3;

      const point = new DOMPoint(1, 2);
      const result = geometry.translateToGivenOrigin(point, 0, 0, 10, 20);

      expect(result.x).toBe(12);
      expect(result.y).toBe(26);
    });

    test('should handle translate transform', () => {
      geometry.translateX = 5;
      geometry.translateY = 10;

      const point = new DOMPoint(10, 20);
      const result = geometry.translateToGivenOrigin(point, 0, 0, 0, 0);
      expect(result.x).toBe(15);
      expect(result.y).toBe(30);
    });

    test('should handle rotate transform', () => {
      geometry.rotate = 90;

      const point = new DOMPoint(1, 0);
      const result = geometry.translateToGivenOrigin(point, 0, 0, 10, 10);

      expect(result.x).toBeCloseTo(10);
      expect(result.y).toBeCloseTo(11);
    });

    test('should handle scale&rotate&translate transform', () => {
      geometry.scaleX = 2;
      geometry.rotate = 90;
      geometry.translateX = 5;

      const point = new DOMPoint(1, 0);
      const result = geometry.translateToGivenOrigin(point, 0, 0, 10, 10);
      expect(result.x).toBeCloseTo(15);
      expect(result.y).toBeCloseTo(12);
    });
  })

  describe('getRelativePositionByOrigin', () => {
    // 基础测试：无变换的情况
    test('should return correct position with no transformations', () => {
      geometry.x = 100
      geometry.y = 50
      geometry.width = 200
      geometry.height = 100

      const absPoint = new DOMPoint(150, 100) // 心绝对坐标
      const result = geometry.getRelativePositionByOrigin(absPoint, 0, 0)

      // 预期结果：绝对坐标减去元素位置后的相对坐标（原点为0,0）
      expect(result.x).toBeCloseTo(150)
      expect(result.y).toBeCloseTo(100)
    })

    // 测试原点转换
    test('should handle different origin points', () => {
      geometry.width = 200
      geometry.height = 100

      const absPoint = new DOMPoint(200, 100) // 绝对坐标对应元素原点
      const result = geometry.getRelativePositionByOrigin(absPoint, 200, 100)

      // 预期原点转换后坐标为(0,0)
      expect(result.x).toBeCloseTo(0)
      expect(result.y).toBeCloseTo(0)
    })

    // 测试缩放变换
    test('should handle scaling transformations', () => {
      parentGeometry.scaleX = 2
      parentGeometry.scaleY = 0.5

      const absPoint = new DOMPoint(200, 25) // 缩放后的绝对坐标
      const result = geometry.getRelativePositionByOrigin(absPoint, 0, 0)

      // 预期结果：反向缩放后的坐标 (200/2=100, 25/0.5=50)
      expect(result.x).toBeCloseTo(100)
      expect(result.y).toBeCloseTo(50)
    })

    // 测试旋转变换
    test('should handle rotation transformations', () => {
      geometry.rotate = 90 // 顺时针旋转90度

      const absPoint = new DOMPoint(50, -100) // 旋转后的点（原始点100,0）
      const result = geometry.getRelativePositionByOrigin(absPoint, 0, 0)

      // 应用逆旋转后的坐标应为(100, 0)
      expect(result.x).toBeCloseTo(50)
      expect(result.y).toBeCloseTo(-100)
    })

    // 测试父元素变换的影响
    test('should consider parent transformations', () => {
      parentGeometry.x = 100
      parentGeometry.y = 100

      geometry.x = 50
      geometry.y = 50

      // 绝对坐标点位于子元素原点
      const absPoint = new DOMPoint(150, 150)
      const result = geometry.getRelativePositionByOrigin(absPoint, 0, 0)

      // 预期结果：相对坐标应为子元素原点 (50,50) 减去父位置后的 (0,0)
      expect(result.x).toBeCloseTo(50)
      expect(result.y).toBeCloseTo(50)
    })
  })
});
