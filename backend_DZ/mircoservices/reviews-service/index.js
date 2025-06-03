const express = require('express');
const app = express();
app.use(express.json());

const products = [];
let reviewIdCounter = 1;

app.get('/reviews/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const product = products.find(p => p.productId === productId);
  if (!product) {
    return res.json({ productId, reviews: [] });
  }
  res.json(product);
});

app.post('/reviews', (req, res) => {
  const { productId, userId, comment, rating } = req.body;
  if (!productId || !userId || !comment || !rating) {
    return res.status(400).json({ error: 'productId, userId, comment, and rating are required' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  let product = products.find(p => p.productId === productId);
  if (!product) {
    product = { productId, reviews: [] };
    products.push(product);
  }

  const review = { id: reviewIdCounter++, userId, comment, rating };
  product.reviews.push(review);
  res.status(201).json(review);
});

app.delete('/reviews/:productId/:reviewId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const reviewId = parseInt(req.params.reviewId);
  const product = products.find(p => p.productId === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const index = product.reviews.findIndex(r => r.id === reviewId);
  if (index === -1) {
    return res.status(404).json({ error: 'Review not found' });
  }
  const [deletedReview] = product.reviews.splice(index, 1);
  res.json(deletedReview);
});

app.listen(3003, () => {
  console.log('Reviews Service running on port 3003');
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