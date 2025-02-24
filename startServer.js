//server.mjs
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('Hello World!\n');
});

// Запуск локального сервера по указанному порту
const port = 3000;
server.listen(port, '127.0.0.1', () => {
  console.log(`Сервер запущен на 127.0.0.1:${port}`);
});