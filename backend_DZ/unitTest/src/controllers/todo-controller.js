const inquirer = require('inquirer');
const TodoService = require('../services/todo-service');

class TodoController {
  async createNote() {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Введите название заметки:',
        validate: input => input.trim() ? true : 'Название заметки не может быть пустым'
      },
      {
        type: 'input',
        name: 'content',
        message: 'Введите содержимое заметки:',
        validate: input => input.trim() ? true : 'Содержимое заметки не может быть пустым'
      }
    ]);
    return await TodoService.createNote(answers.title, answers.content);
  }

  async listNotes() {
    const notes = await TodoService.listNotes();
    if (notes.length === 0) {
      console.log('Заметки не найдены');
      return [];
    }
    console.log('\nДоступные заметки:');
    notes.forEach((note, index) => console.log(`${index + 1}. ${note}`));
    return notes;
  }

  async readNote() {
    const notes = await TodoService.listNotes();
    if (notes.length === 0) {
      console.log('Заметки не найдены');
      return null;
    }
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'title',
        message: 'Выберите заметку:',
        choices: notes
      }
    ]);
    return await TodoService.readNote(answers.title);
  }

  async editNote() {
    const notes = await TodoService.listNotes();
    if (notes.length === 0) {
      console.log('Заметки не найдены');
      return null;
    }
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'title',
        message: 'Выберите заметку:',
        choices: notes
      },
      {
        type: 'input',
        name: 'content',
        message: 'Введите новое содержимое:',
        validate: input => input.trim() ? true : 'Содержимое заметки не может быть пустым'
      }
    ]);
    return await TodoService.editNote(answers.title, answers.content);
  }

  async deleteNote() {
    const notes = await TodoService.listNotes();
    if (notes.length === 0) {
      console.log('Заметки не найдены');
      return null;
    }
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'title',
        message: 'Выберите заметку для удаления:',
        choices: notes
      }
    ]);
    return await TodoService.deleteNote(answers.title);
  }

  async deleteAllNotes() {
    const notes = await TodoService.listNotes();
    if (notes.length === 0) {
      console.log('Заметки не найдены');
      return null;
    }
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Вы действительно хотите удалить все заметки?',
        default: false
      }
    ]);
    if (answers.confirm) {
      return await TodoService.deleteAllNotes();
    }
    console.log('Отмена удаления всех заметок');
    return null;
  }
}

module.exports = new TodoController();