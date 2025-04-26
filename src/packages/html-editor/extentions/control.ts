import { ElementObject } from '@/packages/html-editor/object'
import type { EventOrigin } from '@/packages/html-editor/mitter.ts'

export interface Options {
  width: number
  color: string
  style: 'solid' | 'dashed' | 'dotted'
  margin: number
  position: 'absolute' | 'relative'
}

export class Control {
  options: Options = {
    width: 2,
    color: 'green',
    style: 'solid',
    margin: 10,
    position: 'absolute',
  }
  private readonly svg: SVGSVGElement
  private t: SVGLineElement
  private r: SVGLineElement
  private b: SVGLineElement
  private l: SVGLineElement
  // 四个圆形按钮
  private tlCircle: SVGCircleElement
  private trCircle: SVGCircleElement
  private brCircle: SVGCircleElement
  private blCircle: SVGCircleElement
  private readonly obj: ElementObject
  private resizeObserver: ResizeObserver

  constructor(root: HTMLElement, obj: ElementObject, options?: Partial<Options>) {
    this.options = { ...this.options, ...options }

    // 创建 SVG 元素
    this.svg = this.createSvgElement()
    root.appendChild(this.svg)

    // 创建控制线
    this.t = this.createLine()
    this.r = this.createLine()
    this.b = this.createLine()
    this.l = this.createLine()

    this.tlCircle = this.createCircle()
    this.trCircle = this.createCircle()
    this.brCircle = this.createCircle()
    this.blCircle = this.createCircle()

    this.svg.append(
      this.t,
      this.r,
      this.b,
      this.l,
      this.tlCircle,
      this.trCircle,
      this.brCircle,
      this.blCircle
    )

    // 添加尺寸监听
    this.resizeObserver = new ResizeObserver(() => this.updateSvgSize(root))
    this.resizeObserver.observe(root)

    this.obj = obj
    this.setupEventListeners()
    this.updateControl()
  }

  remove() {
    this.resizeObserver.disconnect()
    this.svg.remove()
    this.obj.off('applying:transform', this.updateTransform)
    this.obj.off('applying:position', this.updatePosition)
  }

  private createSvgElement(): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.style.position = 'absolute'
    svg.style.left = '0'
    svg.style.top = '0'
    svg.style.pointerEvents = 'none' // 默认禁用事件
    return svg
  }

  private createCircle(): SVGCircleElement {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('r', '6') // 设置半径
    circle.setAttribute('fill', '#fff') // 填充白色
    circle.setAttribute('stroke', this.options.color) // 边框使用主题色
    circle.setAttribute('stroke-width', '2') // 边框宽度
    circle.style.pointerEvents = 'auto' // 允许交互事件
    return circle
  }

  private createLine(): SVGLineElement {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('stroke', this.options.color)
    line.setAttribute('stroke-width', this.options.width.toString())
    line.setAttribute('stroke-dasharray', this.getDashStyle())
    line.style.pointerEvents = 'visibleStroke' // 仅线条响应事件
    return line
  }

  private getDashStyle(): string {
    switch (this.options.style) {
      case 'dashed':
        return '5,5'
      case 'dotted':
        return '2,2'
      default:
        return 'none'
    }
  }

  private updateSvgSize(root: HTMLElement) {
    const rect = root.getBoundingClientRect()
    this.svg.setAttribute('width', rect.width.toString())
    this.svg.setAttribute('height', rect.height.toString())
  }

  private setupEventListeners() {

    this.obj.on('applying:transform', this.updateTransform)

    this.obj.on('applying:position', this.updatePosition)
  }

  private updateTransform = (event: unknown, origin: EventOrigin) => {
    if (origin === 'children') return
    this.updateControl()
  }

  private updatePosition = (event: unknown, origin: EventOrigin) => {
    if (origin !== 'self') return
    this.updateControl()
  }

  private updateControl() {
    const c = this.options.position === 'absolute'? this.obj.calcACoords(this.options.margin) : this.obj.calcOCoords(this.options.margin)

    // 更新四条线坐标
    this.t.setAttribute('x1', c.tl.x.toString())
    this.t.setAttribute('y1', c.tl.y.toString())
    this.t.setAttribute('x2', c.tr.x.toString())
    this.t.setAttribute('y2', c.tr.y.toString())

    this.r.setAttribute('x1', c.tr.x.toString())
    this.r.setAttribute('y1', c.tr.y.toString())
    this.r.setAttribute('x2', c.br.x.toString())
    this.r.setAttribute('y2', c.br.y.toString())

    this.b.setAttribute('x1', c.bl.x.toString())
    this.b.setAttribute('y1', c.bl.y.toString())
    this.b.setAttribute('x2', c.br.x.toString())
    this.b.setAttribute('y2', c.br.y.toString())

    this.l.setAttribute('x1', c.tl.x.toString())
    this.l.setAttribute('y1', c.tl.y.toString())
    this.l.setAttribute('x2', c.bl.x.toString())
    this.l.setAttribute('y2', c.bl.y.toString())

    this.tlCircle.setAttribute('cx', c.tl.x.toString())
    this.tlCircle.setAttribute('cy', c.tl.y.toString())
    this.trCircle.setAttribute('cx', c.tr.x.toString())
    this.trCircle.setAttribute('cy', c.tr.y.toString())
    this.brCircle.setAttribute('cx', c.br.x.toString())
    this.brCircle.setAttribute('cy', c.br.y.toString())
    this.blCircle.setAttribute('cx', c.bl.x.toString())
    this.blCircle.setAttribute('cy', c.bl.y.toString())
  }
}

export function useControl(root: HTMLElement, obj: ElementObject, options?: Partial<Options>) {
  return new Control(root, obj, options)
}
