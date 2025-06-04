const express = require('express');
const multer = require('multer');
const amqp = require('amqplib');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const upload = multer({ dest: 'uploads/' });
const CHUNK_SIZE = 1024 * 1024;
const QUEUE_FILE_CHUNKS = 'file_chunks';

async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_FILE_CHUNKS, { durable: true });
  return { connection, channel };
}

async function startService() {
  const { channel } = await connectRabbitMQ();

  app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      const fileId = uuidv4();
      const filePath = req.file.path;
      const fileSize = req.file.size;
      const fileName = req.file.originalname;
      const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);

      console.log(`Загруженный файл ${fileId}, размер файла: ${fileSize} байт, всего чанков: ${totalChunks}`);

      const readStream = fs.createReadStream(filePath, { highWaterMark: CHUNK_SIZE });
      let chunkNumber = 0;

      readStream.on('data', (chunk) => {
        const task = {
          fileId,
          fileName,
          chunkNumber,
          chunk: chunk.toString('base64'),
          totalChunks
        };
        channel.sendToQueue(QUEUE_FILE_CHUNKS, Buffer.from(JSON.stringify(task)), { persistent: true });
        console.log(`Чанк ${chunkNumber} отправлен для файла ${fileId}`);
        chunkNumber++;
      });

      readStream.on('end', async () => {
        console.log(`Завершена отправка ${chunkNumber} чанка для файла ${fileId}`);
        try {
          await fs.promises.unlink(filePath);
        } catch (error) {
          console.error(`Ошибка при удалении временного файла ${filePath}:`, error);
        }
      });

      readStream.on('error', (error) => {
        console.error(`Ошибка при чтении файла ${fileId}:`, error);
        res.status(500).json({ error: 'Ошибка при обработке файла' });
      });

      res.json({ message: 'Начало загрузки', fileId });
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
      res.status(500).json({ error: 'Ошибка при обработке файла' });
    }
  });

  app.listen(3001, () => console.log('Запущено на 3001'));
}

startService().catch(console.error);