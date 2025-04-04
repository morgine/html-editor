import { ElementObject } from '../object'

declare module '../object' {
  interface ElementObjectEvents {
    'object:editing': boolean
  }
}

export function useEditable(obj: ElementObject) {
  let isEditing = false
  let pressTimer: ReturnType<typeof setTimeout> | null = null

  const startEditing = () => {
    if (isEditing) return
    isEditing = true
    obj.el.style.cursor = 'text'
    obj.el.setAttribute('contenteditable', 'true')
    obj.el.focus()
    obj.emit('object:editing', isEditing)

    const onBlur = () => {
      isEditing = false
      obj.el.removeAttribute('contenteditable')
      obj.el.style.cursor = ''
      obj.emit('object:editing', isEditing)
    }
    obj.el.addEventListener('blur', onBlur, { once: true })
  }

  // 桌面端：双击触发
  obj.el.addEventListener('dblclick', (e) => {
    e.stopPropagation()
    startEditing()
  })

  // 移动端：长按触发
  obj.el.addEventListener('touchstart', (e) => {
    e.stopPropagation()
    if (isEditing) return
    pressTimer = setTimeout(() => {
      startEditing()
      e.preventDefault() // 阻止默认上下文菜单
    }, 500)
  }, { passive: false })

  obj.el.addEventListener('touchend', () => {
    if (pressTimer) {
      clearTimeout(pressTimer)
      pressTimer = null
    }
  })

  obj.el.addEventListener('touchmove', () => {
    if (pressTimer) {
      clearTimeout(pressTimer)
      pressTimer = null
    }
  })

  // 全局阻止上下文菜单
  // obj.el.addEventListener('contextmenu', (e) => {
  //   e.preventDefault()
  // })
}
