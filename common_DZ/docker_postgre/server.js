const express = require('express');
const { Pool } = require('pg');

const server = express();
const port = 3000;

const pool = new Pool({
  user: 'user',
  host: 'postgres',
  database: 'mydb',
  password: 'password',
  port: 5432,
});

server.get('/', async (req, res) => {
  try {
    const usersResult = await pool.query('SELECT * FROM Users');
    const tasksResult = await pool.query(`
      SELECT t.*, u.firstname, u.lastname, u.email
      FROM Tasks t
      LEFT JOIN Users u ON t.user_id = u.id
    `);
    res.json({
      users: usersResult.rows,
      tasks: tasksResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error: ' + err.message);
  }
});

server.listen(port, () => {
  console.log(`Сервер запущен на ${port}`);
});