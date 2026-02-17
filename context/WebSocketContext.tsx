
import React, { createContext, useContext, useState, useEffect } from 'react';
import { socketService } from '../services/WebSocketService';
import { useConnectivity } from './ConnectivityContext';

interface WebSocketContextType {
  status: 'connected' | 'disconnected' | 'connecting';
  socket: typeof socketService;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnline } = useConnectivity();
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting'>(
    socketService.getStatus() === 'connected' ? 'connected' : 'disconnected'
  );

  useEffect(() => {
    const handleOpen = () => setStatus('connected');
    const handleClose = () => setStatus('disconnected');

    const offOpen = socketService.on('open', handleOpen);
    const offClose = socketService.on('close', handleClose);

    return () => {
      offOpen();
      offClose();
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      // In a real app, socketService would handle reconnection internally, 
      // but we explicitly tell it to connect if we just regained internet.
      // socketService.connect(); 
    } else {
      socketService.disconnect();
    }
  }, [isOnline]);

  return (
    <WebSocketContext.Provider value={{ status, socket: socketService }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error('useWebSocket must be used within a WebSocketProvider');
  return context;
};
