import { TypedEmitter } from './event.ts'

export type ElementObjectKey = keyof CSSStyleDeclaration | keyof ElementObject

export type ElementObjectEvents = {
  fieldChange: ElementObjectKey
}

export class ElementObject extends TypedEmitter<ElementObjectEvents> {
  el: HTMLElement
  parent: ElementObject | null = null
  children: ElementObject[] = []
  width: number = 0
  height: number = 0
  left: number = 0
  top: number = 0
  background: string = ''
  transform: number[] = [1, 0, 0, 1, 0, 0]

  isListenEvent: boolean = true
  // 是否开启父元素碰撞检测
  isParentCollisionDetection: boolean = false

  constructor(el: HTMLElement) {
    super()
    el.style.transformOrigin = '0 0'
    el.style.touchAction = 'none' // 阻止默认触摸行为
    this.el = el

    // 同时监听鼠标和触摸事件
    this.el.addEventListener('mousedown', this.handlePointerDown)
    this.el.addEventListener('touchstart', this.handlePointerDown)
  }

  public set<K extends ElementObjectKey>(key: K, value: unknown): void {
    if (key ) {
      switch (key) {
        case 'width':
          this.width = value as number
          this.el.style.width = `${this.width}px`
          break
        case 'height':
          this.height = value as number
          this.el.style.height = `${this.height}px`
          break
        case 'left':
          this.left = value as number
          this.el.style.left = `${this.left}px`
          break
        case 'top':
          this.top = value as number
          this.el.style.top = `${this.top}px`
          break
        case 'background':
          this.background = value as string
          this.el.style.background = this.background
          break
        case 'transform':
          this.transform = value as number[]
          this.el.style.transform = `matrix(${this.transform.join(',')})`
          break
        case 'isListenEvent':
          this.isListenEvent = value as boolean
          break
        case 'isParentCollisionDetection':
          this.isParentCollisionDetection = value as boolean
          break
        default:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          this.el.style[key] = value
          break
      }
    }
    this.emit('fieldChange', key)
  }

  // 统一的事件处理函数
  private handlePointerDown = (event: MouseEvent | TouchEvent) => {
    if (!this.isListenEvent) return
    event.stopPropagation()
    event.preventDefault()

    // 获取初始坐标
    const [startX, startY] = this.getEventCoordinates(event)
    const startLeft = this.left
    const startTop = this.top

    const handlePointerMove = (moveEvent: MouseEvent | TouchEvent) => {
      const [clientX, clientY] = this.getEventCoordinates(moveEvent)

      // 计算偏移量（考虑父级缩放）
      const parentScaleX = this.parent?.transform[0] || 1
      const parentScaleY = this.parent?.transform[3] || 1
      const deltaX = (clientX - startX) / parentScaleX
      const deltaY = (clientY - startY) / parentScaleY
      let newLeft = startLeft + deltaX
      let newTop = startTop + deltaY

      // 父元素碰撞检测
      if (this.isParentCollisionDetection) {
        const parent = this.parent
        if (parent) {
          // 水平边界检测
          const maxLeft = parent.width - (this.width * this.transform[0])
          newLeft = Math.min(newLeft, maxLeft)
          newLeft = Math.max(newLeft, 0)
          // 垂直边界检测
          const maxTop = parent.height - (this.height * this.transform[3])
          newTop = Math.min(newTop, maxTop)
          newTop = Math.max(newTop, 0)
        }
      }

      this.set('left', newLeft)
      this.set('top', newTop)
    }

    const handlePointerUp = () => {
      // 移除所有事件监听
      document.removeEventListener('mousemove', handlePointerMove)
      document.removeEventListener('touchmove', handlePointerMove)
      document.removeEventListener('mouseup', handlePointerUp)
      document.removeEventListener('touchend', handlePointerUp)
    }

    // 添加事件监听（同时支持鼠标和触摸）
    document.addEventListener('mousemove', handlePointerMove)
    document.addEventListener('touchmove', handlePointerMove, { passive: false })
    document.addEventListener('mouseup', handlePointerUp)
    document.addEventListener('touchend', handlePointerUp)
  }

  // 获取坐标的辅助方法
  private getEventCoordinates(event: MouseEvent | TouchEvent): [number, number] {
    if (event instanceof TouchEvent) {
      return [
        event.touches?.[0].clientX || 0,
        event.touches?.[0].clientY || 0
      ]
    }
    return [event.clientX, event.clientY]
  }

  public add(obj: ElementObject) {
    this.el.appendChild(obj.el)
    obj.parent = this
    this.children.push(obj)
  }
}
