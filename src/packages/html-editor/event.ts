import mitt from 'mitt'
import type { Emitter, EventHandlerMap, Handler } from 'mitt'

// 泛型基类
export class TypedEmitter<Events extends Record<keyof Events, unknown>> {
  // 内部使用 mitt 实例
  protected emitter: Emitter<Events>;

  constructor() {
    this.emitter = mitt<Events>();
  }

  get all(): EventHandlerMap<Events> {
    return this.emitter.all
  }

  on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void {
    this.emitter.on(type, handler);
  }

  off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void {
    this.emitter.off(type, handler);
  }

  emit<Key extends keyof Events>(type: Key, args: Events[Key]): void {
    this.emitter.emit(type, args);
  }
}

