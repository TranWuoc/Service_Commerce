type Callback = (msg) => void;

class ChatObserver {
  private listeners: Callback[] = [];

  subscribe(callback: Callback) {
    this.listeners.push(callback);
  }

  unsubscribe(callback: Callback) {
    this.listeners = this.listeners.filter((cb) => cb !== callback);
  }

  notify(message) {
    this.listeners.forEach((cb) => cb(message));
  }
}

export const chatObserver = new ChatObserver();