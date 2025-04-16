const http = require('http');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

console.log('Loaded environment variables:', process.env);

const host = process.env.HOST;
const port = process.env.PORT;

let message;
switch (process.env.NODE_ENV) {
  case 'local':
    message = 'Hello';
    break;
  case 'dev':
    message = 'Hello world and galaxy!';
    break;
  case 'prod':
    message = 'Hello world!';
    break;
  default:
    message = 'Environment not recognized!';
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(`${message}\n`);
});

server.listen(port, host, () => {
  console.log(`Сервер запущен на ${host}:${port}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('API URL:', process.env.API_URL);
  console.log('Database Host:', process.env.DB_HOST);
  console.log('Database Port:', process.env.DB_PORT);
  console.log('Log Level:', process.env.LOG_LEVEL);
});