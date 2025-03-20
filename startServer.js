const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('Hello World!\n');
});

const host = '127.0.0.1';
const port = 3000;

server.listen(port, host, () => {
  console.log(`Сервер запущен на ${host}:${port}`);
});