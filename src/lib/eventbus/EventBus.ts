import type { AppEvent, EventHandler } from './types';

class EventBus {
  private handlers: Map<string, Set<EventHandler>>;
  private static instance: EventBus;

  private constructor() {
    this.handlers = new Map();
  }

  // Singleton accessor
  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  // Subscribe to events with type safety
  subscribe<T = any>(
    eventType: string,
    handler: EventHandler<T>
  ): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler as EventHandler);

    // Return unsubscribe function for cleanup
    return () => {
      const handlers = this.handlers.get(eventType);
      if (handlers) {
        handlers.delete(handler as EventHandler);
      }
    };
  }

  // Emit events to all subscribers
  emit<T extends AppEvent>(event: T): void {
    console.log(`[EventBus] ${event.type}`, event.payload);

    const handlers = this.handlers.get(event.type);
    if (handlers) {
      handlers.forEach(async (handler) => {
        try {
          await handler(event.payload);
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error);
        }
      });
    }
  }

  // Utility for debugging
  getSubscriberCount(eventType: string): number {
    return this.handlers.get(eventType)?.size ?? 0;
  }
}

export default EventBus;
