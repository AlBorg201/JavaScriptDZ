"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function (o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const Contact_1 = require("./models/Contact");
const User_1 = require("./models/User");
const sequelize_1 = require("sequelize");
const fs = __importStar(require("fs/promises"));
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = require("passport-github2");
const express_session_1 = __importDefault(require("express-session"));
const connect_sqlite3_1 = __importDefault(require("connect-sqlite3"));
const SQLiteStore = (0, connect_sqlite3_1.default)(express_session_1.default);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' }),
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findByPk(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback',
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let user = yield User_1.User.findOne({ where: { githubId: profile.id } });
        if (!user) {
            user = yield User_1.User.create({
                githubId: profile.id,
                displayName: profile.displayName || profile.username,
                email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value,
            });
        }
        done(null, user);
    }
    catch (err) {
        done(err);
    }
})));
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Необходимо войти в систему' });
};
app.use(express_1.default.json());
app.get('/auth/github', passport_1.default.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/gitub/callback', passport_1.default.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/contacts');
});
app.get('/login', (req, res) => {
    res.json({ message: 'Please authenticate using /auth/github' });
});
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка выхода' });
        }
        res.json({ message: 'Выход выполнен' });
    });
});
function loadInitialData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const count = yield Contact_1.Contact.count();
            if (count > 0) {
                console.log('Данные уже существуют в базе, пропускаем импорт');
                return;
            }
            const data = yield fs.readFile('contacts.json', 'utf8');
            const contacts = JSON.parse(data);
            yield Contact_1.Contact.bulkCreate(contacts);
            console.log('Данные из contacts.json успешно импортированы в базу данных');
        }
        catch (error) {
            console.error('Ошибка при импорте данных из JSON:', error);
        }
    });
}
// Обертка для асинхронных обработчиков
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            console.error('AsyncHandler error:', err.stack);
            next(err);
        });
    };
};
app.get('/contacts', ensureAuthenticated, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contacts = yield Contact_1.Contact.findAll();
    res.status(200).json(contacts);
})));
app.get('/contacts/id/:id', ensureAuthenticated, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield Contact_1.Contact.findByPk(parseInt(req.params.id));
    if (contact) {
        res.status(200).json(contact);
    }
    else {
        res.status(404).json({ error: 'Контакт не найден' });
    }
})));
app.get('/contacts/by-name', ensureAuthenticated, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fullName = req.query.fullName;
    if (!fullName) {
        return res.status(400).json({ error: 'Параметр fullName обязателен' });
    }
    const contacts = yield Contact_1.Contact.findAll({
        where: database_1.sequelize.where(database_1.sequelize.fn('lower', database_1.sequelize.col('fullName')), {
            [sequelize_1.Op.like]: `%${fullName.toLowerCase()}%`,
        }),
    });
    res.status(200).json(contacts);
})));
app.get('/contacts/sort-by-name', ensureAuthenticated, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
    const contacts = yield Contact_1.Contact.findAll({
        order: [['fullName', order]],
    });
    res.status(200).json(contacts);
})));
app.get('/contacts/sort-by-address', ensureAuthenticated, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
    const contacts = yield Contact_1.Contact.findAll({
        order: [['address', order]],
    });
    res.status(200).json(contacts);
})));
app.post('/contacts', ensureAuthenticated, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, phone, address } = req.body;
    if (!fullName || !phone || !address) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    const newContact = yield Contact_1.Contact.create({ fullName, phone, address });
    res.status(201).json(newContact);
})));
app.delete('/contacts/id/:id', ensureAuthenticated, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield Contact_1.Contact.findByPk(parseInt(req.params.id));
    if (contact) {
        yield contact.destroy();
        res.status(200).json({ message: 'Контакт удален' });
    }
    else {
        res.status(404).json({ error: 'Контакт не найден' });
    }
})));
app.delete('/contacts/by-surname', ensureAuthenticated, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const surname = req.query.surname;
    if (!surname) {
        return res.status(400).json({ error: 'Параметр surname обязателен' });
    }
    const deleted = yield Contact_1.Contact.destroy({
        where: database_1.sequelize.where(database_1.sequelize.fn('lower', database_1.sequelize.col('fullName')), {
            [sequelize_1.Op.like]: `${surname.toLowerCase()}%`,
        }),
    });
    if (deleted > 0) {
        res.status(200).json({ message: 'Контакты удалены' });
    }
    else {
        res.status(404).json({ error: 'Контакты не найдены' });
    }
})));
app.delete('/contacts/clear', ensureAuthenticated, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Contact_1.Contact.destroy({ where: {} });
    res.status(200).json({ message: 'Книга контактов очищена' });
})));
app.use((req, res) => {
    res.status(404).json({ error: 'Страница не найдена' });
});
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Ошибка:`, err.stack);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Получен SIGINT. Завершаем работу сервера...');
    yield database_1.sequelize.close();
    process.exit(0);
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Получен SIGTERM. Завершаем работу сервера...');
    yield database_1.sequelize.close();
    process.exit(0);
}));
database_1.sequelize.sync({ force: true }).then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield loadInitialData();
    app.listen(PORT, () => {
        console.log('Сервер запущен на http://localhost:3000');
        console.log('Доступные действия:');
        console.log('Аутентификация:');
        console.log('1. GitHub: http://localhost:3000/auth/github');
        console.log('После входа:');
        console.log('GET http://localhost:3000/contacts/by-name?fullName=Ivanov');
    });
}));
exports.default = app;
//# sourceMappingURL=app.js.map