const express = require('express');
const todoRoutes = require('./routes/todo-routes');

const app = express();
app.use(express.json());
app.use('/api', todoRoutes);

module.exports = app;