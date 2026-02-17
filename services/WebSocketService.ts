
import { Message, Notification } from '../types';

/**
 * Mock WebSocket Service
 * Simulates real-time bidirectional communication between the app and a server.
 * Handles reconnection logic and mock server responses for chat and notifications.
 */

type WebSocketCallback = (data: any) => void;

class MockWebSocketService {
  private listeners: { [event: string]: WebSocketCallback[] } = {};
  private isConnected: boolean = false;
  private reconnectTimeout: any = null;

  constructor() {
    this.connect();
    // Simulate server-side automated events
    this.setupMockServerBehavior();
  }

  private connect() {
    if (this.isConnected) return;
    
    // Simulate connection delay
    setTimeout(() => {
      this.isConnected = true;
      this.emit('open', { status: 'connected' });
      console.log('WebSocket Connected (Mock)');
    }, 500);
  }

  public disconnect() {
    this.isConnected = false;
    this.emit('close', { reason: 'manual_disconnect' });
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
  }

  public on(event: string, callback: WebSocketCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  public off(event: string, callback: WebSocketCallback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  public send(event: string, payload: any) {
    if (!this.isConnected) {
      console.warn('WebSocket is not connected. Message queued or failed.');
      return;
    }

    console.log(`[WebSocket Send] ${event}:`, payload);

    // Mock server processing and routing
    if (event === 'chat_message') {
      this.handleIncomingChatMessage(payload);
    } else if (event === 'typing_status') {
      // Server would broadcast this to the other party
    }
  }

  private handleIncomingChatMessage(message: Message) {
    // Simulate server acknowledging message receipt
    setTimeout(() => {
      this.emit('read_receipt', { messageId: message.id, status: 'delivered' });
    }, 800);

    setTimeout(() => {
      this.emit('read_receipt', { messageId: message.id, status: 'read' });
    }, 2000);

    // Simulate customer reply
    setTimeout(() => {
      this.emit('typing_status', { isTyping: true, userId: 'customer_1' });
    }, 2500);

    setTimeout(() => {
      this.emit('typing_status', { isTyping: false, userId: 'customer_1' });
      const reply: Message = {
        id: `server_${Date.now()}`,
        sender: 'customer',
        text: 'وصلت الرسالة، أنا بانتظارك عند الباب الرئيسي للمبنى. شكراً لك.',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      };
      this.emit('chat_message', reply);
    }, 5000);
  }

  private setupMockServerBehavior() {
    // Periodically push "system" or "order" updates to simulate real-world activity
    setInterval(() => {
      if (this.isConnected && Math.random() > 0.9) {
        const notif: Notification = {
          id: `ws_notif_${Date.now()}`,
          title: 'تحديث حي 📡',
          body: 'يوجد نشاط عالي حالياً في منطقة "حي النخيل"، توجه هناك لفرص أفضل.',
          type: 'system',
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          read: false
        };
        this.emit('notification', notif);
      }
    }, 45000);
  }

  public getStatus() {
    return this.isConnected ? 'connected' : 'disconnected';
  }
}

export const socketService = new MockWebSocketService();
