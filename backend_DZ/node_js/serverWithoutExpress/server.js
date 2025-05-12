const http = require('http');
const url = require('url');
const fs = require('fs').promises;

// Начальная загрузка данных из файла или пустой массив
let contacts = [];

async function loadContacts() {
  try {
    const data = await fs.readFile('contacts.json', 'utf8');
    contacts = JSON.parse(data);
  } catch (error) {
    console.log('Файл contacts.json не найден или содержит ошибки, начинаем с пустой книги');
    contacts = [];
  }
}

// Вспомогательная функция для парсинга тела запроса
const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Создание сервера
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Установка заголовков ответа
  res.setHeader('Content-Type', 'application/json');

  // GET-запросы
  if (req.method === 'GET') {
    // i) Получить все контакты
    if (path === '/contacts') {
      res.statusCode = 200;
      res.end(JSON.stringify(contacts));
      return;
    }

    // ii) Контакт по id
    if (path.startsWith('/contacts/id/')) {
      const id = parseInt(path.split('/')[3]);
      const contact = contacts.find(c => c.id === id);
      if (contact) {
        res.statusCode = 200;
        res.end(JSON.stringify(contact));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Контакт не найден' }));
      }
      return;
    }

    // ii) Контакт по ФИО
    if (path === '/contacts/by-name') {
      const fullName = query.fullName;
      const contact = contacts.filter(c => c.fullName.toLowerCase().includes(fullName.toLowerCase()));
      res.statusCode = 200;
      res.end(JSON.stringify(contact));
      return;
    }

    // iii) Сортировка по ФИО
    if (path === '/contacts/sort-by-name') {
      const order = query.order === 'desc' ? -1 : 1;
      const sorted = [...contacts].sort((a, b) => 
        order * a.fullName.localeCompare(b.fullName)
      );
      res.statusCode = 200;
      res.end(JSON.stringify(sorted));
      return;
    }

    // iv) Сортировка по адресам
    if (path === '/contacts/sort-by-address') {
      const order = query.order === 'desc' ? -1 : 1;
      const sorted = [...contacts].sort((a, b) => 
        order * a.address.localeCompare(b.address)
      );
      res.statusCode = 200;
      res.end(JSON.stringify(sorted));
      return;
    }
  }

  // POST-запросы
  if (req.method === 'POST' && path === '/contacts') {
    try {
      const body = await getRequestBody(req);
      if (!body.fullName || !body.phone || !body.address) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Все поля обязательны' }));
        return;
      }
      const newContact = {
        id: contacts.length ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
        fullName: body.fullName,
        phone: body.phone,
        address: body.address
      };
      contacts.push(newContact);
      res.statusCode = 201;
      res.end(JSON.stringify(newContact));
      return;
    } catch (error) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Неверный формат данных' }));
      return;
    }
  }

  // DELETE-запросы
  if (req.method === 'DELETE') {
    // i) Удалить контакт по id
    if (path.startsWith('/contacts/id/')) {
      const id = parseInt(path.split('/')[3]);
      const index = contacts.findIndex(c => c.id === id);
      if (index !== -1) {
        contacts.splice(index, 1);
        res.statusCode = 200;
        res.end(JSON.stringify({ message: 'Контакт удален' }));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Контакт не найден' }));
      }
      return;
    }

    // ii) Удалить контакт(ы) по фамилии
    if (path === '/contacts/by-surname') {
      const surname = query.surname;
      const initialLength = contacts.length;
      contacts = contacts.filter(c => !c.fullName.toLowerCase().startsWith(surname.toLowerCase()));
      if (contacts.length < initialLength) {
        res.statusCode = 200;
        res.end(JSON.stringify({ message: 'Контакты удалены' }));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Контакты не найдены' }));
      }
      return;
    }

    // iii) Очистить всю книгу
    if (path === '/contacts/clear') {
      contacts = [];
      res.statusCode = 200;
      res.end(JSON.stringify({ message: 'Книга контактов очищена' }));
      return;
    }
  }

  // Обработка несуществующих маршрутов
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Страница не найдена' }));
});

// Запуск сервера после загрузки контактов
const PORT = 3000;
loadContacts().then(() => {
  server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
});