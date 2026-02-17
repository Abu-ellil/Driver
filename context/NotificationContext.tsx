import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Notification } from '../types';
import { NotificationService } from '../services/NotificationService';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeBanner, setActiveBanner] = useState<Notification | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Initial Sync from "Backend"
  useEffect(() => {
    const init = async () => {
      setSyncing(true);
      const remote = await NotificationService.fetchRemoteNotifications();
      setNotifications(remote);
      setSyncing(false);
      setLastSynced(new Date().toLocaleTimeString('ar-SA'));
      await NotificationService.registerDeviceForPush();
    };
    init();

    // Setup a "background sync" simulation every 30 seconds
    const interval = setInterval(async () => {
      const remote = await NotificationService.fetchRemoteNotifications();
      // Only update if we have new notifications
      if (remote && remote.length > notifications.length) {
        setNotifications(remote);
        // Trigger banner for the latest new one
        const newest = remote[0];
        if (newest && !newest.read) {
          setActiveBanner(newest);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [notifications.length]);

  const manualSync = async () => {
    setSyncing(true);
    const remote = await NotificationService.fetchRemoteNotifications();
    setNotifications(remote);
    setSyncing(false);
    setLastSynced(new Date().toLocaleTimeString('ar-SA'));
  };

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...n,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    setActiveBanner(newNotif);
    
    // Auto clear banner after 4 seconds
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
