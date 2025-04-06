import { ElementObject, type ElementObjectKey } from '../object'

export interface Options {
  size: number
  bgColor: string
  textColor: string
  eachTickPixels: number
  xBoxShadow: string
  yBoxShadow: string
}

export class Ruler {
  containerEl: HTMLElement
  watch: ElementObject
  resizeObserver: ResizeObserver
  xEl: HTMLElement
  yEl: HTMLElement
  options: Options = {
    size: 16,
    bgColor: '#fff',
    textColor: '#000',
    eachTickPixels: 50,
    xBoxShadow: '0 2px 2px rgba(0, 0, 0, 0.2)',
    yBoxShadow: '2px 0 2px rgba(0, 0, 0, 0.2)',
  }

  constructor(containerEl: HTMLElement, watch: ElementObject, options?: Partial<Options>) {
    this.options = { ...this.options, ...options }
    this.containerEl = containerEl
    this.watch = watch
    this.xEl = this.createRulerContainer('x')
    this.yEl = this.createRulerContainer('y')
    containerEl.appendChild(this.xEl)
    containerEl.appendChild(this.yEl)
    this.listenEvent()
    this.resizeObserver = new ResizeObserver(() => {
      this.render()
    })
    this.resizeObserver.observe(containerEl)
  }

  private createRulerContainer(type: 'x' | 'y'): HTMLElement {
    const el = document.createElement('div')
    el.className = `ruler-${type}`
    el.style.position = 'absolute'
    el.style.zIndex = '9999'
    if (type === 'x') {
      el.style.left = '0'
      el.style.top = '0'
      el.style.backgroundColor = this.options.bgColor
      el.style.width = '100%'
      el.style.borderBottom = '0.5px solid #ccc'
      el.style.height = `${this.options.size}px`
      el.style.boxShadow = this.options.xBoxShadow
    } else {
      el.style.left = '0'
      el.style.top = '0'
      el.style.backgroundColor = this.options.bgColor
      el.style.width = `${this.options.size}px`
      el.style.borderRight = '0.5px solid #ccc'
      el.style.height = '100%'
      el.style.boxShadow = this.options.yBoxShadow
    }
    return el
  }

  private listenEvent() {
    const listenKeys: Set<ElementObjectKey> = new Set([
      'scaleX',
      'scaleY',
      'translateX',
      'translateY',
    ])
    this.watch.on('update:key', (key) => {
      if (Array.isArray(key)) {
        if (key.some(k => listenKeys.has(k))) {
          this.render()
        }
      } else {
        if (listenKeys.has(key)) {
          this.render()
        }
      }
    })
  }

  private render = () => {
    const width = this.containerEl.clientWidth
    const height = this.containerEl.clientHeight
    const { xTicks, yTicks } = this.buildTicks(width, height)
    this.xEl.innerHTML = this.buildXSVG(width, xTicks)
    this.yEl.innerHTML = this.buildYSVG(height, yTicks)
  }

  private buildTicks(width: number, height: number): { xTicks: number[]; yTicks: number[] } {
    // 每个刻度的像素
    const eachTickPixels = this.options.eachTickPixels

    // 刻度取值
    const intervals = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000]

    const scaleX = this.watch.scaleX
    const scaleY = this.watch.scaleY
    const translateX = this.watch.translateX
    const translateY = this.watch.translateY

    // 计算刻度间隔
    const intervalX = intervals.find((i) => i * scaleX >= eachTickPixels)
    if (!intervalX) {
      return { xTicks: [], yTicks: [] }
    }
    const intervalY = intervals.find((i) => i * scaleY >= eachTickPixels)
    if (!intervalY) {
      return { xTicks: [], yTicks: [] }
    }

    // 计算刻度列表 (X轴方向)

    let startX = -(translateX / scaleX)
    // 按 intervalX 取整
    startX = Math.floor(startX / intervalX) * intervalX
    const endX = startX + width / scaleX
    const xTicks = []
    for (let x = startX; x <= endX; x += intervalX) {
      xTicks.push(x)
    }

    // 计算刻度列表（Y轴方向）
    let startY = -(translateY / scaleY)
    startY = Math.floor(startY / intervalY) * intervalY
    const endY = startY + height / scaleY
    const yTicks = []
    for (let y = startY; y <= endY; y += intervalY) {
      yTicks.push(y)
    }
    return { xTicks, yTicks }
  }

  private buildXSVG(width: number, ticks: number[]) {
    const translateX = this.watch.translateX
    const scaleX = this.watch.scaleX
    const size = this.options.size

    return `<svg
    width="${width}"
    height="${size}"
    viewBox="${-translateX} 0 ${width} ${size}"
  >
    ${ticks
      .map(
        (tick) => `
      <g transform="translate(${tick * scaleX}, 0)">
        <line
          x1="0"
          y1="${size}"
          x2="0"
          y2="${size-4}"
          stroke="${this.options.textColor}"
          stroke-width="0.75"
        />
        <text
          x="0"
          y="${size - 8}"
          fill="${this.options.textColor}"
          font-size="10"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          ${tick}
        </text>
      </g>`,
      )
      .join('')}
  </svg>`
  }

  private buildYSVG(height: number, ticks: number[]) {
    const translateY = this.watch.translateY
    const scaleY = this.watch.scaleY
    const size = this.options.size

    return `<svg
    width="${size}"
    height="${height}"
    viewBox="0 ${-translateY} ${size} ${height}"
    >
    ${ticks
      .map(
        (tick) => `
      <g transform="translate(0, ${tick * scaleY})">
        <line
          x1="${size}"
          y1="0"
          x2="${size - 4}"
          y2="0"
          stroke="${this.options.textColor}"
          stroke-width="0.75"
        />
        <text
          x="${size - 8}"
          y="0"
          fill="${this.options.textColor}"
          font-size="10"
          text-anchor="middle"
          dominant-baseline="middle"
          transform="rotate(-90, ${size - 8}, 0)"
        >
          ${tick}
        </text>
      </g>`,
      )
      .join('')}
  </svg>`
  }
}

export function useRuler(container: HTMLElement, watch: ElementObject, options?: Partial<Options>) {
  return new Ruler(container, watch, options)
}
