
export enum Screen {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  ORDERS = 'ORDERS',
  PROFILE = 'PROFILE',
  ACTIVE_TRIP = 'ACTIVE_TRIP',
  PAYMENT = 'PAYMENT',
  CHAT = 'CHAT',
  REVIEW_PENDING = 'REVIEW_PENDING',
  NOTIFICATIONS = 'NOTIFICATIONS',
  ORDER_DETAILS = 'ORDER_DETAILS'
}

export interface Order {
  id: string;
  price: string;
  stores: string[];
  distance: string;
  time: string;
  type: 'Multi' | 'Single' | 'Heavy';
  status: string;
}

export interface Message {
  id: string;
  sender: 'customer' | 'driver';
  text: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'order' | 'message' | 'system' | 'payment';
  timestamp: string;
  read: boolean;
}
