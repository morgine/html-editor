import mitt  from 'mitt'
import type { Emitter, EventHandlerMap, Handler, WildcardHandler } from 'mitt'

export type EventOrigin = 'children' | 'parent' | 'self' // 事件来源

export interface EventArgs {
  origin: EventOrigin
}

// 泛型基类
export class TypedEmitter<Events extends Record<keyof Events, EventArgs>> {
  // 内部使用 mitt 实例
  protected emitter: Emitter<Events>;

  constructor() {
    this.emitter = mitt<Events>();
  }

  getAllListeners(): EventHandlerMap<Events> {
    return this.emitter.all
  }

  on<Key extends keyof Events, Event extends Events[Key]>(type: Key, handler: (event: Event, origin: EventOrigin) => void): void {
    this.emitter.on(type, (event: Events[Key]) => {
      const { origin } = event;
      handler(event as Event, origin);
    });
  }

  onAll<Key extends keyof Events, Event extends Events[Key]>(handler: (type: Key, event: Event, origin: EventOrigin) => void): void {
    // this.emitter.on('*', (type: Key, event: Events[Key]) => {
    //   const { origin } = event;
    //   handler(type, event as Event, origin);
    // });

    const wildcardHandler: WildcardHandler<Events> = (type, event) => {
      const { origin } = event;
      handler(type as Key, event as Event, origin);
    }

    this.emitter.on('*', wildcardHandler)
  }

  off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void {
    this.emitter.off(type, handler);
  }

  emit<Key extends keyof Events>(type: Key, args: Events[Key], origin: EventOrigin = 'self'): void {
    args['origin'] = origin;
    this.emitter.emit(type, args);
  }
}

