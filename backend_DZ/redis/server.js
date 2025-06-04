const express = require('express');
const jwt = require('jsonwebtoken');
const { registrationRateLimiter, postRateLimiter } = require('./rateLimiter');

const app = express();
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Токен не предоставлен' });

  jwt.verify(token, 'secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Недействительный токен' });
    req.user = user;
    next();
  });
};

app.post('/register', async (req, res) => {
  const clientIp = req.ip;
  try {
    await registrationRateLimiter(clientIp);
    res.status(200).json({ message: 'Регистрация прошла успешно' });
  } catch (error) {
    res.status(429).json({ error: error.message });
  }
});

app.post('/protected', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    await postRateLimiter(userId);
    res.status(200).json({ message: 'POST-запрос выполнен' });
  } catch (error) {
    res.status(429).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Сервер запущен на 3000'));