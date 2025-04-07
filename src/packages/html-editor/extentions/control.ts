import { ElementObject } from '@/packages/html-editor/object'

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

    // 添加尺寸监听
    this.resizeObserver = new ResizeObserver(() => this.updateSvgSize(root))
    this.resizeObserver.observe(root)

    this.obj = obj
    this.setupEventListeners()
    this.updateControl()
  }

  private createSvgElement(): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.style.position = 'absolute'
    svg.style.left = '0'
    svg.style.top = '0'
    svg.style.pointerEvents = 'none' // 默认禁用事件
    return svg
  }

  private createLine(): SVGLineElement {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('stroke', this.options.color)
    line.setAttribute('stroke-width', this.options.width.toString())
    line.setAttribute('stroke-dasharray', this.getDashStyle())
    line.style.pointerEvents = 'visibleStroke' // 仅线条响应事件
    this.svg.appendChild(line)
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

    this.obj.on('applying:transform', (event, origin) => {
      if (origin === 'children') return
      this.updateControl()
    })

    this.obj.on('applying:position', (event, origin) => {
      if (origin !== 'self') return
      this.updateControl()
    })
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
  }
}

export function useControl(root: HTMLElement, obj: ElementObject, options?: Partial<Options>) {
  return new Control(root, obj, options)
}
