import { Sequelize } from 'sequelize-typescript';
import { Contact } from '../models/Contact';
import { User } from '../models/User';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './contacts.db',
  models: [Contact, User],
  logging: console.log,
});