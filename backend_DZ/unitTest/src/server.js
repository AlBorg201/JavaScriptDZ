#!/usr/bin/env node
const app = require('./app');
const inquirer = require('inquirer');
const TodoController = require('./controllers/todo-controller');
const TodoService = require('./services/todo-service');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function mainMenu() {
  await TodoService.ensureNotesDir();

  const choices = [
    { name: '1. Список заметок', value: 'list' },
    { name: '2. Прочитать заметку', value: 'read' },
    { name: '3. Создать заметку', value: 'create' },
    { name: '4. Изменить заметку', value: 'edit' },
    { name: '5. Удалить заметку', value: 'delete' },
    { name: '6. Удалить все заметки', value: 'deleteAll' },
    { name: '7. Выход', value: 'exit' }
  ];

  while (true) {
    try {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Главное меню',
          choices
        }
      ]);

      switch (answers.action) {
        case 'list':
          await TodoController.listNotes();
          break;
        case 'read':
          await TodoController.readNote();
          break;
        case 'create':
          await TodoController.createNote();
          break;
        case 'edit':
          await TodoController.editNote();
          break;
        case 'delete':
          await TodoController.deleteNote();
          break;
        case 'deleteAll':
          await TodoController.deleteAllNotes();
          break;
        case 'exit':
          process.exit(0);
      }
    } catch (error) {
      console.error('Ошибка в главном меню:', error.message);
    }
  }
}

mainMenu().catch(error => {
  console.error('Ошибка:', error.message);
  process.exit(1);
});