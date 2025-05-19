#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const inquirer = require('inquirer');

const NOTES_DIR = path.join(__dirname, 'notes');

async function ensureNotesDir() {
    try {
        await fs.mkdir(NOTES_DIR, { recursive: true });
    } catch (error) {
        console.error('Ошибка при создании директории:', error.message);
        process.exit(1);
    }
}

async function createNote() {
    try {
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

        const filePath = path.join(NOTES_DIR, `${answers.title}.txt`);
        await fs.writeFile(filePath, answers.content);
        console.log(`Заметка "${answers.title}" создана`);
    } catch (error) {
        console.error('Ошибка при создании заметки:', error.message);
    }
}

async function listNotes() {
    try {
        const files = await fs.readdir(NOTES_DIR);
        if (files.length === 0) {
            console.log('Заметки не найдены');
            return;
        }
        console.log('\nДоступные заметки:');
        files.forEach((file, index) => {
            console.log(`${index + 1}. ${path.basename(file, '.txt')}`);
        });
    } catch (error) {
        console.error('Ошибка при получении списка заметок:', error.message);
    }
}

async function readNote() {
    try {
        const files = await fs.readdir(NOTES_DIR);
        if (files.length === 0) {
            console.log('Заметки не найдены');
            return;
        }

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'title',
                message: 'Выберите заметку:',
                choices: files.map(file => path.basename(file, '.txt'))
            }
        ]);

        const filePath = path.join(NOTES_DIR, `${answers.title}.txt`);
        const content = await fs.readFile(filePath, 'utf8');
        console.log(`\nЗаметка: ${answers.title}`);
        console.log('Содержимое:', content);
    } catch (error) {
        console.error('Ошибка при чтении заметки:', error.message);
    }
}

async function editNote() {
    try {
        const files = await fs.readdir(NOTES_DIR);
        if (files.length === 0) {
            console.log('Заметки не найдены');
            return;
        }

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'title',
                message: 'Выберите заметку:',
                choices: files.map(file => path.basename(file, '.txt'))
            },
            {
                type: 'input',
                name: 'content',
                message: 'Введите новое содержимое:',
                validate: input => input.trim() ? true : 'Содержимое заметки не может быть пустым'
            }
        ]);

        const filePath = path.join(NOTES_DIR, `${answers.title}.txt`);
        await fs.writeFile(filePath, answers.content);
        console.log(`Заметка "${answers.title}" обновлена`);
    } catch (error) {
        console.error('Ошибка при редактировании заметки:', error.message);
    }
}

async function deleteNote() {
    try {
        const files = await fs.readdir(NOTES_DIR);
        if (files.length === 0) {
            console.log('Заметки не найдены');
            return;
        }

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'title',
                message: 'Выберите заметку для удаления:',
                choices: files.map(file => path.basename(file, '.txt'))
            }
        ]);

        const filePath = path.join(NOTES_DIR, `${answers.title}.txt`);
        await fs.unlink(filePath);
        console.log(`Заметка "${answers.title}" удалена`);
    } catch (error) {
        console.error('Ошибка при удалении заметки:', error.message);
    }
}

async function deleteAllNotes() {
    try {
        const files = await fs.readdir(NOTES_DIR);
        if (files.length === 0) {
            console.log('Заметки не найдены.');
            return;
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
            for (const file of files) {
                await fs.unlink(path.join(NOTES_DIR, file));
            }
            console.log('Все заметки удалены');
        } else {
            console.log('Отмена удаления всех заметок');
        }
    } catch (error) {
        console.error('Ошибка при удалении всех заметок:', error.message);
    }
}

async function mainMenu() {
    await ensureNotesDir();

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
                    await listNotes();
                    break;
                case 'read':
                    await readNote();
                    break;
                case 'create':
                    await createNote();
                    break;
                case 'edit':
                    await editNote();
                    break;
                case 'delete':
                    await deleteNote();
                    break;
                case 'deleteAll':
                    await deleteAllNotes();
                    break;
                case 'exit':
                    return;
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