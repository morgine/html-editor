import mitt  from 'mitt'
import type { Emitter, Handler, WildcardHandler } from 'mitt'

export type EventOrigin = 'children' | 'parent' | 'self' // 事件来源

export interface Event {
  origin?: EventOrigin // 事件来源

  [key: string]: unknown // 其他属性
}

// 泛型基类
export class TypedEmitter<Events extends Record<keyof Events, Event>> {
  // 内部使用 mitt 实例
  protected emitter: Emitter<Events> = mitt<Events>();

  clear() {
    this.emitter.all.clear()
  }

  on<Key extends keyof Events, Event extends Events[Key]>(type: Key, handler: (event: Event, origin: EventOrigin) => void): void {
    this.emitter.on(type, (event: Events[Key]) => {
      const { origin } = event;
      handler(event as Event, origin || 'self');
    });
  }

  onEach<Key extends keyof Events, Event extends Events[Key]>(handler: (type: Key, event: Event, origin: EventOrigin) => void): void {

    const wildcardHandler: WildcardHandler<Events> = (type, event) => {
      const { origin } = event;
      handler(type as Key, event as Event, origin || 'self');
    }

    this.emitter.on('*', wildcardHandler)
  }

  off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void {
    this.emitter.off(type, handler);
  }

  emit<Key extends keyof Events>(type: Key, event: Events[Key], origin: EventOrigin = 'self'): void {
    event.origin = origin;
    this.emitter.emit(type, event);
  }
}

