import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.manualDisconnect = false;
  }

  connect(token) {
    if (this.socket?.connected) return;
    if (this.manualDisconnect) return;
    if (!token) {
      console.warn('No token for socket');
      return;
    }

    const socketUrl = import.meta.env.DEV 
      ? 'http://localhost:5500'  
      : import.meta.env.VITE_API_URL; 

    console.log('🔌 Connecting socket to:', socketUrl);

    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 5,
      timeout: 10000,
      autoConnect: false,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
      this.emit('connect');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connect error:', error.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      this.emit('disconnect');
      if (reason === 'io client disconnect') {
        this.manualDisconnect = true;
      }
    });

    this.socket.onAny((event, ...args) => {
      const listeners = this.listeners.get(event) || [];
      listeners.forEach(callback => callback(...args));
    });

    // ✅ Manually connect
    this.socket.connect();
  }

  disconnect() {
    this.manualDisconnect = true;
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    const listeners = this.listeners.get(event) || [];
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  emit(event, ...args) {
    if (this.socket?.connected) {
      this.socket.emit(event, ...args);
    } else {
      console.warn('⚠️ Socket not connected, cannot emit:', event);
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketClient = new SocketClient();
