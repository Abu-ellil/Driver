
import { Notification } from '../types';

/**
 * Mock Backend Service to simulate push notification synchronization.
 * In a real-world app, this would use fetch/axios to communicate with a REST/GraphQL API
 * and Web Push API or Firebase Cloud Messaging for background tasks.
 */

const STORAGE_KEY = 'captain_notifications_backend';

export const NotificationService = {
  // Simulate fetching notifications from a remote server
  async fetchRemoteNotifications(): Promise<Notification[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const notifications: Notification[] = stored ? JSON.parse(stored) : [];
        
        // Randomly simulate a "new" remote notification if the server has something new
        if (Math.random() > 0.7) {
          const remoteNotif: Notification = {
            id: `remote_${Date.now()}`,
            title: 'تنبيه من النظام 🛡️',
            body: 'تم تحديث سياسة الخصوصية الخاصة بالوكالة، يرجى مراجعتها.',
            type: 'system',
            timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            read: false,
          };
          const updated = [remoteNotif, ...notifications];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          resolve(updated);
        } else {
          resolve(notifications);
        }
      }, 800); // Simulate network latency
    });
  },

  // Synchronize local state to "server"
  async syncToServer(notifications: Notification[]): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        resolve();
      }, 500);
    });
  },

  // Register device for push (Simulation)
  async registerDeviceForPush(): Promise<boolean> {
    console.log('Registering device with Backend for Push Notifications...');
    return true;
  }
};
