"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
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
// В начало файла src/app.ts
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const Contact_1 = require("./models/Contact");
const sequelize_1 = require("sequelize");
const fs = __importStar(require("fs/promises"));
// Обертка для асинхронных обработчиков
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// Функция для загрузки данных из JSON
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
// GET
app.get('/contacts', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contacts = yield Contact_1.Contact.findAll();
    res.status(200).json(contacts);
})));
app.get('/contacts/id/:id', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield Contact_1.Contact.findByPk(parseInt(req.params.id));
    if (contact) {
        res.status(200).json(contact);
    }
    else {
        res.status(404).json({ error: 'Контакт не найден' });
    }
})));
app.get('/contacts/by-name', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName } = req.query;
    const contacts = yield Contact_1.Contact.findAll({
        where: {
            fullName: { [sequelize_1.Op.iLike]: `%${fullName}%` }
        }
    });
    res.status(200).json(contacts);
})));
app.get('/contacts/sort-by-name', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
    const contacts = yield Contact_1.Contact.findAll({
        order: [['fullName', order]]
    });
    res.status(200).json(contacts);
})));
app.get('/contacts/sort-by-address', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
    const contacts = yield Contact_1.Contact.findAll({
        order: [['address', order]]
    });
    res.status(200).json(contacts);
})));
// POST
app.post('/contacts', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, phone, address } = req.body;
    if (!fullName || !phone || !address) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    const newContact = yield Contact_1.Contact.create({ fullName, phone, address });
    res.status(201).json(newContact);
})));
// DELETE
app.delete('/contacts/id/:id', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield Contact_1.Contact.findByPk(parseInt(req.params.id));
    if (contact) {
        yield contact.destroy();
        res.status(200).json({ message: 'Контакт удален' });
    }
    else {
        res.status(404).json({ error: 'Контакт не найден' });
    }
})));
app.delete('/contacts/by-surname', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { surname } = req.query;
    const deleted = yield Contact_1.Contact.destroy({
        where: {
            fullName: { [sequelize_1.Op.iLike]: `${surname}%` }
        }
    });
    if (deleted > 0) {
        res.status(200).json({ message: 'Контакты удалены' });
    }
    else {
        res.status(404).json({ error: 'Контакты не найдены' });
    }
})));
app.delete('/contacts/clear', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Contact_1.Contact.destroy({ where: {} });
    res.status(200).json({ message: 'Книга контактов очищена' });
})));
// Error handling
app.use((req, res) => {
    res.status(404).json({ error: 'Страница не найдена' });
});
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Ошибка:`, err.message);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});
// Graceful shutdown
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
// Start server
database_1.sequelize.sync({ force: false }).then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield loadInitialData();
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
}));
exports.default = app;
//# sourceMappingURL=app.js.map