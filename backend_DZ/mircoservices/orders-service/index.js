const express = require('express');
const EventEmitter = require('events');
const app = express();
app.use(express.json());

const orders = [];
let orderIdCounter = 1;

const orderEmitter = new EventEmitter();

class Order {
  constructor(userId, productId, status = 'pending') {
    this.id = orderIdCounter++;
    this.userId = userId;
    this.productId = productId;
    this.status = status;
    this.createdAt = new Date();
  }
}

app.get('/orders/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userOrders = orders.filter(order => order.userId === userId);
  res.json(userOrders);
});

app.post('/orders', (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({ error: 'userId and productId are required' });
  }
  const order = new Order(userId, productId);
  orders.push(order);
  res.status(201).json(order);
});

app.post('/orders/:id/purchase', (req, res) => {
  const orderId = parseInt(req.params.id);
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  if (order.status !== 'pending') {
    return res.status(400).json({ error: 'Order cannot be purchased' });
  }
  order.status = 'purchased';
  orderEmitter.emit('orders.purchase', order);
  res.json(order);
});

app.delete('/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  const [deletedOrder] = orders.splice(index, 1);
  res.json(deletedOrder);
});

app.listen(3001, () => {
  console.log('Orders Service running on port 3001');
});

const consul = new (require('consul'))();
const serviceName = 'orders-service';
const serviceId = `${serviceName}-${process.pid}`;

consul.agent.service.register({
  name: serviceName,
  id: serviceId,
  address: 'localhost',
  port: 3001,
  check: {
    http: 'http://localhost:3001/health',
    interval: '10s',
    timeout: '5s'
  }
}, (err) => {
  if (err) console.error('Failed to register service:', err);
  console.log(`Registered ${serviceName} with Consul`);
});

app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

module.exports = { orderEmitter };