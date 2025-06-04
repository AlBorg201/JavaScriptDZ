"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Contact_1 = require("../models/Contact");
const User_1 = require("../models/User");
exports.sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'sqlite',
    storage: './contacts.db',
    models: [Contact_1.Contact, User_1.User],
    logging: console.log,
});
//# sourceMappingURL=database.js.map