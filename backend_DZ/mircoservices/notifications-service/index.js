const express = require('express');
const EventEmitter = require('events');
const emailjs = require('@emailjs/nodejs');
const app = express();
app.use(express.json());

const emailConfig = {
  service_id: 'service_id',
  template_id: 'template_id',
  public_key: 'public_key',
  private_key: 'private_key'
};

emailjs.init({ publicKey: emailConfig.public_key, privateKey: emailConfig.private_key });

const notificationEmitter = new EventEmitter();

app.post('/notifications', (req, res) => {
  const { to, subject, text } = req.body;
  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'to, subject, and text are required' });
  }

  emailjs.send(emailConfig.service_id, emailConfig.template_id, {
    to_email: to,
    subject,
    message: text
  }).then(() => {
    res.status(200).json({ message: 'Email sent successfully' });
  }).catch(err => {
    res.status(500).json({ error: 'Failed to send email', details: err });
  });
});

notificationEmitter.on('auth.register', (user) => {
  emailjs.send(emailConfig.service_id, emailConfig.template_id, {
    to_email: user.email,
    subject: 'Welcome to Our Platform!',
    message: `Hello, ${user.name}! Thank you for registering.`
  }).catch(err => console.error('Failed to send registration email:', err));
});

notificationEmitter.on('orders.purchase', (order) => {
  emailjs.send(emailConfig.service_id, emailConfig.template_id, {
    to_email: 'user@example.com',
    subject: 'Order Purchase Receipt',
    message: `Your order #${order.id} has been successfully purchased.`
  }).catch(err => console.error('Failed to send purchase email:', err));
});

notificationEmitter.on('users.deleteUser', (user) => {
  emailjs.send(emailConfig.service_id, emailConfig.template_id, {
    to_email: user.email,
    subject: 'Account Deletion Confirmation',
    message: `Hello, ${user.name}. Your account has been deleted.`
  }).catch(err => console.error('Failed to send deletion email:', err));
});

app.listen(3002, () => {
  console.log('Notifications Service running on port 3002');
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

module.exports = { notificationEmitter };