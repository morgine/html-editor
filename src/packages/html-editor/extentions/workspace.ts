import { Editor } from '../editor'
import { ElementObject } from '../object'

declare module '../editor' {
  interface Editor {
    workspace: Workspace
  }
}

export interface Options {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  background?: string;
}

export class Workspace extends ElementObject {

  constructor(editor: Editor, options?: Options) {
    options = {
      width: 500,
      height: 400,
      left: 0,
      top: 0,
      background: '#fff',
      ...options,
    }
    const el = document.createElement('div');
    el.className = 'workspace';
    el.style.position = 'absolute';
    el.style.overflow = 'hidden';
    super(el)
    for (const [key, value] of Object.entries(options)) {
      this.set(key as keyof Options, value)
    }
    // this.set('isListenEvent', false)
    editor.el.prepend(el);
    editor.workspace = this
    editor.on('dispose', () => {
      // 清空所有事件
      this.all.clear()
    })
  }
}

export function useWorkspace(editor: Editor, options?: Options) {
  return new Workspace(editor, options)
}
