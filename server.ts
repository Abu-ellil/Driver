
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

// Fix: Using 'as any' cast for middleware to handle potential type incompatibilities between connect and express in TS
app.use(cors() as any);
app.use(express.json() as any);

// --- قاعدة بيانات وهمية (Simulated DB) ---
let drivers = [
  { id: 'd1', name: 'أحمد محمد', phone: '0551234567', status: 'offline', rating: 4.9, wallet: -1250.00, vehicle: 'Toyota Corolla 2021' }
];

let orders = [
  { id: '1', price: 45.50, stores: ['برجر بالاس'], distance: 3.2, time: 25, type: 'Multi', status: 'Available', location: { lat: 24.7136, lng: 46.6753 } },
  { id: '2', price: 12.00, stores: ['ماما ميا بيتزا'], distance: 1.5, time: 12, type: 'Single', status: 'Available', location: { lat: 24.7236, lng: 46.6853 } }
];

let messages: any[] = [];
let notifications: any[] = [];

// --- Schemas (TypeScript Interfaces for Backend) ---
interface Driver {
  id: string;
  name: string;
  status: 'online' | 'offline';
  wallet: number;
}

interface OrderUpdate {
  orderId: string;
  status: 'Accepted' | 'PickingUp' | 'Delivering' | 'Completed';
  driverId: string;
}

// --- Endpoints (REST API) ---

// 1. تسجيل الدخول
app.post('/api/auth/login', (req, res) => {
  const { identity, password } = req.body;
  const driver = drivers.find(d => d.phone === identity || d.id === 'd1'); 
  res.json({ success: true, driver, token: 'mock-jwt-token' });
});

// 2. تحديث حالة السائق (متصل/غير متصل)
app.put('/api/driver/status', (req, res) => {
  const { driverId, status } = req.body;
  const driver = drivers.find(d => d.id === driverId);
  if (driver) {
    driver.status = status;
    io.emit('driver_status_changed', { driverId, status });
    res.json({ success: true, status: driver.status });
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// 3. جلب الطلبات المتاحة (بناءً على الموقع)
app.get('/api/orders/available', (req, res) => {
  const availableOrders = orders.filter(o => o.status === 'Available');
  res.json(availableOrders);
});

// 4. قبول طلب
app.post('/api/orders/accept', (req, res) => {
  const { orderId, driverId } = req.body;
  const order = orders.find(o => o.id === orderId);
  if (order && order.status === 'Available') {
    order.status = 'Accepted';
    // إرسال إشعار فوري عبر الـ Socket للعميل وللسائقين الآخرين
    io.emit('order_taken', { orderId });
    res.json({ success: true, order });
  } else {
    res.status(400).json({ error: 'Order no longer available' });
  }
});

// 5. نظام المحفظة والمدفوعات
app.get('/api/driver/:id/wallet', (req, res) => {
  const driver = drivers.find(d => d.id === req.params.id);
  res.json({ balance: driver?.wallet || 0 });
});

app.post('/api/payments/pay', (req, res) => {
  const { driverId, amount, method } = req.body;
  const driver = drivers.find(d => d.id === driverId);
  if (driver) {
    driver.wallet += parseFloat(amount);
    res.json({ success: true, newBalance: driver.wallet });
  }
});

// --- WebSocket Logic (Socket.io) ---
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // إرسال رسائل المحادثة
  socket.on('chat_message', (msg) => {
    messages.push(msg);
    // توجيه الرسالة للطرف الآخر (العميل)
    socket.broadcast.emit('chat_message', msg);
    
    // محاكاة تقرير الاستلام والقراءة
    setTimeout(() => {
      socket.emit('read_receipt', { messageId: msg.id, status: 'delivered' });
    }, 1000);
    setTimeout(() => {
      socket.emit('read_receipt', { messageId: msg.id, status: 'read' });
    }, 3000);
  });

  // تحديث حالة الكتابة
  socket.on('typing_status', (data) => {
    socket.broadcast.emit('typing_status', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
