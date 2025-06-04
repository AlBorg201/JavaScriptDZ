const amqp = require('amqplib');
const fs = require('fs').promises;
const path = require('path');

const QUEUE_FILE_CHUNKS = 'file_chunks';
const chunksStore = new Map();

async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_FILE_CHUNKS, { durable: true });
  return { connection, channel };
}

async function saveFile(fileId, fileName, totalChunks) {
  const chunks = chunksStore.get(fileId);
  if (chunks && chunks.length === totalChunks && chunks.every(chunk => chunk !== null)) {
    try {
      const filePath = path.join('uploads', `${fileId}_${fileName}`);
      const fileBuffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk.chunk, 'base64')));
      await fs.writeFile(filePath, fileBuffer);
      console.log(`File saved: ${filePath}`);
      chunksStore.delete(fileId);
      return true;
    } catch (error) {
      console.error(`Ошибка при сохранении файла ${fileId}:`, error);
      return false;
    }
  } else {
    console.log(`Получены не все чанки для файла ${fileId}. Получено: ${chunks.filter(c => c !== null).length}/${totalChunks}`);
    return false;
  }
}

async function startService() {
  const { channel } = await connectRabbitMQ();

  channel.consume(QUEUE_FILE_CHUNKS, async (msg) => {
    if (msg !== null) {
      const { fileId, fileName, chunkNumber, chunk, totalChunks } = JSON.parse(msg.content.toString());
      console.log(`Получен чанк ${chunkNumber} для файла ${fileId}`);

      try {
        if (!chunksStore.has(fileId)) {
          chunksStore.set(fileId, new Array(totalChunks).fill(null));
        }

        chunksStore.get(fileId)[chunkNumber] = { chunk, chunkNumber };

        const saved = await saveFile(fileId, fileName, totalChunks);
        if (saved) {
          channel.ack(msg);
        } else {
          channel.nack(msg, false, true);
        }
      } catch (error) {
        console.error(`Ошибка при обработке чанка ${chunkNumber} для файла ${fileId}:`, error);
        channel.nack(msg, false, true);
      }
    }
  }, { noAck: false });

  console.log('Служба сборки файлов запущена, ожидание чанков');
}

startService().catch(console.error);