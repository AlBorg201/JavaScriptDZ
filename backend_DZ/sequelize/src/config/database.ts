import { Sequelize } from 'sequelize-typescript';
import { Contact } from '../models/Contact';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './contacts.db',
  models: [Contact],
  logging: false,
});