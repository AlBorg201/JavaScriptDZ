import express, { Request, Response, NextFunction } from 'express';
import { sequelize } from './config/database';
import { Contact } from './models/Contact';
import { Op } from 'sequelize';
import * as fs from 'fs/promises';

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

async function loadInitialData() {
  try {
    const count = await Contact.count();
    if (count > 0) {
      console.log('Данные уже существуют в базе, импорт не требуется');
      return;
    }
    const data = await fs.readFile('contacts.json', 'utf8');
    const contacts = JSON.parse(data);
    await Contact.bulkCreate(contacts);
    console.log('Данные из contacts.json успешно импортированы в базу данных');
  } catch (error) {
    console.error('Ошибка при импорте данных из JSON:', error);
  }
}

//GET
app.get('/contacts', asyncHandler(async (req: Request, res: Response) => {
  const contacts = await Contact.findAll();
  res.status(200).json(contacts);
}));

app.get('/contacts/id/:id', asyncHandler(async (req: Request, res: Response) => {
  const contact = await Contact.findByPk(parseInt(req.params.id));
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ error: 'Контакт не найден' });
  }
}));

app.get('/contacts/by-name', asyncHandler(async (req: Request, res: Response) => {
  const { fullName } = req.query as { fullName: string };
  const contacts = await Contact.findAll({
    where: {
      fullName: { [Op.like]: `%${fullName}%` }
    }
  });
  res.status(200).json(contacts);
}));

app.get('/contacts/sort-by-name', asyncHandler(async (req: Request, res: Response) => {
  const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
  const contacts = await Contact.findAll({
    order: [['fullName', order]]
  });
  res.status(200).json(contacts);
}));

app.get('/contacts/sort-by-address', asyncHandler(async (req: Request, res: Response) => {
  const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
  const contacts = await Contact.findAll({
    order: [['address', order]]
  });
  res.status(200).json(contacts);
}));

//POST
app.post('/contacts', asyncHandler(async (req: Request, res: Response) => {
  const { fullName, phone, address } = req.body;
  if (!fullName || !phone || !address) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }
  const newContact = await Contact.create({ fullName, phone, address });
  res.status(201).json(newContact);
}));

//DELETE
app.delete('/contacts/id/:id', asyncHandler(async (req: Request, res: Response) => {
  const contact = await Contact.findByPk(parseInt(req.params.id));
  if (contact) {
    await contact.destroy();
    res.status(200).json({ message: 'Контакт удален' });
  } else {
    res.status(404).json({ error: 'Контакт не найден' });
  }
}));

app.delete('/contacts/by-surname', asyncHandler(async (req: Request, res: Response) => {
  const { surname } = req.query as { surname: string };
  const deleted = await Contact.destroy({
    where: {
      fullName: { [Op.like]: `${surname}%` }
    }
  });
  if (deleted > 0) {
    res.status(200).json({ message: 'Контакты удалены' });
  } else {
    res.status(404).json({ error: 'Контакты не найдены' });
  }
}));

app.delete('/contacts/clear', asyncHandler(async (req: Request, res: Response) => {
  await Contact.destroy({ where: {} });
  res.status(200).json({ message: 'Книга контактов очищена' });
}));

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Страница не найдена' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] Ошибка:`, err.message);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

process.on('SIGINT', async () => {
  console.log('Получен SIGINT, сервер выключается');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Получен SIGTERM, сервер выключается');
  await sequelize.close();
  process.exit(0);
});

sequelize.sync({ force: false }).then(async () => {
  await loadInitialData();
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

export default app;