import type { ElementObject } from '@/packages/html-editor/object'

export function useGuideline(obj: ElementObject) {
  let movingNode: ElementObject
  obj.on('object:moveStart', (node: ElementObject) => {
    if (!obj.children.includes(node)) return
    movingNode = node
    console.log('moveStart', node)
  })
  obj.on('object:moving', (node: ElementObject) => {
    if (!obj.children.includes(node)) return
    console.log(node)
    console.log(node.el.getBoundingClientRect())
    console.log(node.getCoords())
    // const { left, top } = node.el.getBoundingClientRect()

  })
}
