const express = require('express');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

let contacts = [];

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

async function loadContacts() {
  try {
    const data = await fs.readFile('contacts.json', 'utf8');
    contacts = JSON.parse(data);
    console.log('Контакты успешно загружены');
  } catch (error) {
    console.error('Файл contacts.json не найден:', error.message);
    contacts = [];
  }
}

async function saveContacts() {
  try {
    await fs.writeFile('contacts.json', JSON.stringify(contacts, null, 2));
    console.log('Контакты сохранены в contacts.json');
  } catch (error) {
    console.error('Ошибка при сохранении контактов:', error.message);
  }
}

//GET
app.get('/contacts', (req, res) => {
  res.status(200).json(contacts);
});

app.get('/contacts/id/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const contact = contacts.find(c => c.id === id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ error: 'Контакт не найден' });
  }
});

app.get('/contacts/by-name', (req, res) => {
  const { fullName } = req.query;
  const filtered = contacts.filter(c => c.fullName.toLowerCase().includes(fullName.toLowerCase()));
  res.status(200).json(filtered);
});

app.get('/contacts/sort-by-name', (req, res) => {
  const order = req.query.order === 'desc' ? -1 : 1;
  const sorted = [...contacts].sort((a, b) => order * a.fullName.localeCompare(b.fullName));
  res.status(200).json(sorted);
});

app.get('/contacts/sort-by-address', (req, res) => {
  const order = req.query.order === 'desc' ? -1 : 1;
  const sorted = [...contacts].sort((a, b) => order * a.address.localeCompare(b.address));
  res.status(200).json(sorted);
});

//POST
app.post('/contacts', async (req, res) => {
  const { fullName, phone, address } = req.body;
  if (!fullName || !phone || !address) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }
  const newContact = {
    id: contacts.length ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
    fullName,
    phone,
    address
  };
  contacts.push(newContact);
  await saveContacts();
  res.status(201).json(newContact);
});

//DELETE
app.delete('/contacts/id/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const index = contacts.findIndex(c => c.id === id);
  if (index !== -1) {
    contacts.splice(index, 1);
    await saveContacts();
    res.status(200).json({ message: 'Контакт удален' });
  } else {
    res.status(404).json({ error: 'Контакт не найден' });
  }
});

app.delete('/contacts/by-surname', async (req, res) => {
  const { surname } = req.query;
  const initialLength = contacts.length;
  contacts = contacts.filter(c => !c.fullName.toLowerCase().startsWith(surname.toLowerCase()));
  if (contacts.length < initialLength) {
    await saveContacts();
    res.status(200).json({ message: 'Контакты удалены' });
  } else {
    res.status(404).json({ error: 'Контакты не найдены' });
  }
});

app.delete('/contacts/clear', async (req, res) => {
  contacts = [];
  await saveContacts();
  res.status(200).json({ message: 'Книга контактов очищена' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Страница не найдена' });
});

app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Ошибка:`, err.message);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

process.on('SIGINT', async () => {
  console.log('Завершение работы сервера (SIGINT)');
  await saveContacts();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Завершение работы сервера (SIGTERM)');
  await saveContacts();
  process.exit(0);
});

loadContacts().then(() => {
  app.listen(PORT, () => {
    console.log('GET запросы, где можно перейти по ссылке:');
    console.log(`Список контактов: http://localhost:${PORT}/contacts`);
    console.log(`Контакт по id: http://localhost:${PORT}/contacts/id/1`);
    console.log(`Контакт по ФИО: http://localhost:${PORT}/contacts/by-name?fullName=Ivanov`);
    console.log(`Сортировка по ФИО по возрастанию: http://localhost:${PORT}/contacts/sort-by-name?order=asc`);
    console.log(`Сортировка по ФИО по убыванию: http://localhost:${PORT}/contacts/sort-by-name?order=desc`);
    console.log(`Сортировка по адресу по возрастанию: http://localhost:${PORT}/contacts/sort-by-address?order=asc`);
    console.log(`Сортировка по адресу по убыванию: http://localhost:${PORT}/contacts/sort-by-address?order=desc`);
  });
});

module.exports = app;