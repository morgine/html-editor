import { ElementObject } from '@/packages/html-editor/object.ts'
import { getMultiplyCoordsBounds } from '@/packages/html-editor/matrix.ts'


export class Selection extends ElementObject {
  constructor(objects: ElementObject[]) {
    super({
      tag: 'div',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      background: 'rgba(0, 0, 255, 0.2)',
      borderWidth: 1,
      borderColor: 'green',
      borderStyle: 'solid',
    })
    this.el.className = 'selection'
    this.el.style.position = 'absolute'
    this.el.style.zIndex = '999'
    this.update(objects)
  }

  update = (objects: ElementObject[]) => {
    if (objects.length === 0) {
      this.el.style.display = 'none'
      return
    }
    this.el.style.display = 'block'
    const coords = objects.map((object) => {
      return object.calcACoords()
    })
    const boundsRect = getMultiplyCoordsBounds(coords)
    this.setRecords({
      x: boundsRect.x,
      y: boundsRect.y,
      width: boundsRect.width,
      height: boundsRect.height,
    })
    objects.forEach(object => {

      this.add(object)
    })
  }

  listenEvents() {
    window.addEventListener('click', )
  }
}
