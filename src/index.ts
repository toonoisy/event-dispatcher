type EventName = string;
type EventHandlerMap<Events extends Record<EventName, unknown>> = Map<
  keyof Events,
  EventHandler<Events[keyof Events]>[]
>;
type EventHandler<T = unknown> = (params: T) => void;

export default class EventDispatcher<
  T extends Record<EventName, unknown>,
> {
  private map: EventHandlerMap<T> = new Map();

  on<K extends keyof T>(
    key: K,
    handler: EventHandler<T[K]>
  ) {
    const handlers = this.map.get(key);
    if (handlers) {
      handlers.push(handler as EventHandler<T[keyof T]>);
    } else {
      this.map.set(key, [handler] as EventHandler<T[keyof T]>[]);
    }

    return {
      off: () => this.off(key, handler),
    };
  }

  off<K extends keyof T>(
    key: K,
    handler?: EventHandler<T[K]>
  ) {
    if (handler) {
      const handlers = this.map.get(key);
      if (handlers) {
        handlers.splice(handlers.indexOf(handler as EventHandler<T[keyof T]>) >>> 0, 1);
      }
    } else {
      this.map.set(key, []);
    }
  }

  dispatch<K extends keyof T>(key: K, params: T[K]) {
    this.map.get(key)?.forEach((handler) => handler(params));
  }
}
