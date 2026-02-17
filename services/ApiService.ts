
import { Order, Message } from '../types';

const BASE_URL = 'http://localhost:3000/api';

export const ApiService = {
  async login(identity: string, pass: string) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity, password: pass })
    });
    return res.json();
  },

  async toggleStatus(driverId: string, status: 'online' | 'offline') {
    const res = await fetch(`${BASE_URL}/driver/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverId, status })
    });
    return res.json();
  },

  async getAvailableOrders(): Promise<Order[]> {
    const res = await fetch(`${BASE_URL}/orders/available`);
    return res.json();
  },

  async acceptOrder(orderId: string, driverId: string) {
    const res = await fetch(`${BASE_URL}/orders/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, driverId })
    });
    return res.json();
  },

  async payDebt(driverId: string, amount: string, method: string) {
    const res = await fetch(`${BASE_URL}/payments/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverId, amount, method })
    });
    return res.json();
  }
};
