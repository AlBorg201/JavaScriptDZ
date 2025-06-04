const express = require('express');
const multer = require('multer');
const amqp = require('amqplib');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const upload = multer({ dest: 'uploads/' });
const QUEUE_TO_RESIZE = 'resize_tasks';
const QUEUE_RESIZED = 'resized_images';

async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_TO_RESIZE, { durable: true });
  await channel.assertQueue(QUEUE_RESIZED, { durable: true });
  return { connection, channel };
}

async function startService() {
  const { channel } = await connectRabbitMQ();

  channel.consume(QUEUE_RESIZED, async (msg) => {
    if (msg !== null) {
      const { imageId, resizedImagePath } = JSON.parse(msg.content.toString());
      console.log(`Изображение с измененным размером: ${imageId}`);
      channel.ack(msg);
    }
  }, { noAck: false });

  app.post('/upload', upload.single('image'), async (req, res) => {
    try {
      const imageId = uuidv4();
      const originalPath = path.join('uploads', `${imageId}_original${path.extname(req.file.originalname)}`);
      await fs.rename(req.file.path, originalPath);

      const task = { imageId, originalPath };
      channel.sendToQueue(QUEUE_TO_RESIZE, Buffer.from(JSON.stringify(task)), { persistent: true });

      res.json({ message: 'Обработка загруженного изображения', imageId });
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
      res.status(500).json({ error: 'Ошибка при обработке изображения' });
    }
  });

  app.listen(3000, () => console.log('Сервис загрузки изображения запущен'));
}

startService().catch(console.error);