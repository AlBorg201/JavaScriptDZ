const http = require('http');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env.' + process.env.NODE_ENV) });
require('./style.css');

const htmlFilePath = path.resolve(__dirname, '../dist/index.html');
const cssFilePath = path.resolve(__dirname, '../dist/styles.css');

const host = process.env.HOST;
const port = process.env.PORT;

const server = http.createServer((req, res) => {
  console.log(`Получен запрос: ${req.url}`);

  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(htmlFilePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');
        console.error('Error reading HTML file:', err);
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    });
  } else if (req.url === '/styles.css') {
    fs.readFile(cssFilePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');
        console.error('Error reading CSS file:', err);
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/css');
      res.end(data);
    });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

server.listen(port, host, () => {
  console.log(`Сервер запущен на ${host}:${port}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('API URL:', process.env.API_URL);
  console.log('Database Host:', process.env.DB_HOST);
  console.log('Database Port:', process.env.DB_PORT);
  console.log('Log Level:', process.env.LOG_LEVEL);
});