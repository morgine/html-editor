export type EventOrigin = 'children' | 'parent' | 'self'; // 事件来源

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventEmitter<Events extends Record<keyof Events, unknown>> {
  private handlers: {
    [K in keyof Events]?: Array<(event: Events[K], origin: EventOrigin) => void>
  } = Object.create(null);
  private wildcardHandlers: Array<
    <K extends keyof Events>(type: K, event: Events[K], origin: EventOrigin) => void
  > = [];

  clear(): void {
    this.handlers = Object.create(null);
    this.wildcardHandlers = [];
  }

  on<K extends keyof Events>(type: K, handler: (event: Events[K], origin: EventOrigin) => void): void {
    if (!this.handlers[type]) {
      this.handlers[type] = [];
    }
    this.handlers[type]!.push(handler);
  }

  onEach(handler: <K extends keyof Events>(type: K, event: Events[K], origin: EventOrigin) => void): void {
    this.wildcardHandlers.push(handler);
  }

  off<K extends keyof Events>(type: K, handler: (event: Events[K], origin: EventOrigin) => void): void {
    const handlers = this.handlers[type];
    if (handlers) {
      this.handlers[type] = handlers.filter(h => h !== handler);
    }
  }

  offEach(handler: <K extends keyof Events>(type: K, event: Events[K], origin: EventOrigin) => void): void {
    this.wildcardHandlers = this.wildcardHandlers.filter(h => h !== handler);
  }

  emit<K extends keyof Events>(type: K, event: Events[K], origin: EventOrigin = 'self'): void {
    const handlers = this.handlers[type];
    if (handlers) {
      handlers.forEach(handler => handler(event, origin));
    }
    this.wildcardHandlers.forEach(handler => handler(type, event, origin));
  }
}
