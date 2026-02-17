
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Notification } from '../types';
import { NotificationService } from '../services/NotificationService';
import { useWebSocket } from './WebSocketContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  activeBanner: Notification | null;
  clearBanner: () => void;
  syncing: boolean;
  lastSynced: string | null;
  manualSync: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket } = useWebSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeBanner, setActiveBanner] = useState<Notification | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Manual & Initial Sync
  const manualSync = useCallback(async () => {
    setSyncing(true);
    const remote = await NotificationService.fetchRemoteNotifications();
    setNotifications(remote);
    setSyncing(false);
    setLastSynced(new Date().toLocaleTimeString('ar-SA'));
  }, []);

  useEffect(() => {
    manualSync();
  }, [manualSync]);

  // WebSocket Integration for Real-time Notifications
  useEffect(() => {
    const handleWsNotification = (notif: Notification) => {
      setNotifications(prev => [notif, ...prev]);
      setActiveBanner(notif);
      // Auto clear banner
      setTimeout(() => {
        setActiveBanner(current => current?.id === notif.id ? null : current);
      }, 5000);
    };

    const offNotif = socket.on('notification', handleWsNotification);
    return () => offNotif();
  }, [socket]);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...n,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    setActiveBanner(newNotif);
    
    setTimeout(() => {
      setActiveBanner(current => current?.id === newNotif.id ? null : current);
    }, 4000);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearBanner = () => setActiveBanner(null);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      addNotification, 
      markAsRead, 
      activeBanner, 
      clearBanner,
      syncing,
      lastSynced,
      manualSync
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
