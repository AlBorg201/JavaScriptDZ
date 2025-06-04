const amqp = require('amqplib');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

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

  channel.consume(QUEUE_TO_RESIZE, async (msg) => {
    if (msg !== null) {
      const { imageId, originalPath } = JSON.parse(msg.content.toString());
      console.log(`Обработка изображения: ${imageId}`);

      try {
        const resizedImagePath = path.join('uploads', `${imageId}_resized.jpg`);
        await sharp(originalPath)
          .resize(64, 64)
          .toFile(resizedImagePath);

        const result = { imageId, resizedImagePath };
        channel.sendToQueue(QUEUE_RESIZED, Buffer.from(JSON.stringify(result)), { persistent: true });

        console.log(`Обработанное изображение: ${imageId}`);
        channel.ack(msg);
      } catch (error) {
        console.error('Ошибка при обработке изображения:', error);
        channel.nack(msg);
      }
    }
  }, { noAck: false });

  console.log('Сервис изменения изображения запущен');
}

startService().catch(console.error);