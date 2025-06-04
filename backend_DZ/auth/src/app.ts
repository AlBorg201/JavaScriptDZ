import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { sequelize } from './config/database';
import { Contact } from './models/Contact';
import { User } from './models/User';
import { Op } from 'sequelize';
import * as fs from 'fs/promises';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import session from 'express-session';
import SQLiteStoreFactory from 'connect-sqlite3';
import type { Store } from 'express-session';

const SQLiteStore = SQLiteStoreFactory(session) as any as new (options: any) => Store;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done: any) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/auth/github/callback',
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        let user = await User.findOne({ where: { githubId: profile.id } });
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            displayName: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value,
          });
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Необходимо войти в систему' });
};

app.use(express.json());

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get(
  '/auth/gitub/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    res.redirect('/contacts');
  }
);

app.get('/login', (req: Request, res: Response) => {
  res.json({ message: 'Please authenticate using /auth/github' });
});

app.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка выхода' });
    }
    res.json({ message: 'Выход выполнен' });
  });
});

async function loadInitialData() {
  try {
    const count = await Contact.count();
    if (count > 0) {
      console.log('Данные уже существуют в базе, пропускаем импорт');
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

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error('AsyncHandler error:', err.stack);
      next(err);
    });
  };
};

app.get('/contacts', ensureAuthenticated, asyncHandler(async (req: Request, res: Response) => {
  const contacts = await Contact.findAll();
  res.status(200).json(contacts);
}));

app.get('/contacts/id/:id', ensureAuthenticated, asyncHandler(async (req: Request, res: Response) => {
  const contact = await Contact.findByPk(parseInt(req.params.id));
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ error: 'Контакт не найден' });
  }
}));

app.get('/contacts/by-name', ensureAuthenticated, asyncHandler(async (req: Request, res: Response) => {
  const fullName = req.query.fullName as string;
  if (!fullName) {
    return res.status(400).json({ error: 'Параметр fullName обязателен' });
  }
  const contacts = await Contact.findAll({
    where: sequelize.where(sequelize.fn('lower', sequelize.col('fullName')), {
      [Op.like]: `%${fullName.toLowerCase()}%`,
    }),
  });
  res.status(200).json(contacts);
}));

app.get('/contacts/sort-by-name', ensureAuthenticated, asyncHandler(async (req: Request, res: Response) => {
  const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
  const contacts = await Contact.findAll({
    order: [['fullName', order]],
  });
  res.status(200).json(contacts);
}));

app.get('/contacts/sort-by-address', ensureAuthenticated, asyncHandler(async (req: Request, res: Response) => {
  const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
  const contacts = await Contact.findAll({
    order: [['address', order]],
  });
  res.status(200).json(contacts);
}));

app.post('/contacts', ensureAuthenticated, asyncHandler(async (req: Request, res: Response) => {
  const { fullName, phone, address } = req.body;
  if (!fullName || !phone || !address) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }
  const newContact = await Contact.create({ fullName, phone, address });
  res.status(201).json(newContact);
}));

app.delete('/contacts/id/:id', ensureAuthenticated, asyncHandler(async (req: Request, res: Response) => {
  const contact = await Contact.findByPk(parseInt(req.params.id));
  if (contact) {
    await contact.destroy();
    res.status(200).json({ message: 'Контакт удален' });
  } else {
    res.status(404).json({ error: 'Контакт не найден' });
  }
}));

app.delete('/contacts/by-surname', ensureAuthenticated, asyncHandler(async (req: Request, res: Response) => {
  const surname = req.query.surname as string;
  if (!surname) {
    return res.status(400).json({ error: 'Параметр surname обязателен' });
  }
  const deleted = await Contact.destroy({
    where: sequelize.where(sequelize.fn('lower', sequelize.col('fullName')), {
      [Op.like]: `${surname.toLowerCase()}%`,
    }),
  });
  if (deleted > 0) {
    res.status(200).json({ message: 'Контакты удалены' });
  } else {
    res.status(404).json({ error: 'Контакты не найдены' });
  }
}));

app.delete('/contacts/clear', ensureAuthenticated, asyncHandler(async (req: Request, res: Response) => {
  await Contact.destroy({ where: {} });
  res.status(200).json({ message: 'Книга контактов очищена' });
}));

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Страница не найдена' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] Ошибка:`, err.stack);
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

sequelize.sync({ force: true }).then(async () => {
  await loadInitialData();
  app.listen(PORT, () => {
    console.log('Сервер запущен на http://localhost:3000');
    console.log('Доступные действия:');
    console.log('Аутентификация:');
    console.log('1. GitHub: http://localhost:3000/auth/github');
    console.log('После входа:');
    console.log('GET http://localhost:3000/contacts/by-name?fullName=Ivanov');
  });
});

export default app;