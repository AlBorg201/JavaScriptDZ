#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const inquirer = require('inquirer');

const NOTES_DIR = path.join(__dirname, 'notes');

/**
 * Ensures the notes directory exists
 * @returns {Promise<void>}
 */
async function ensureNotesDir() {
    try {
        await fs.mkdir(NOTES_DIR, { recursive: true });
    } catch (error) {
        console.error('Error creating notes directory:', error.message);
        process.exit(1);
    }
}

/**
 * Creates a new note
 * @returns {Promise<void>}
 */
async function createNote() {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter note title:',
                validate: input => input.trim() ? true : 'Title cannot be empty'
            },
            {
                type: 'input',
                name: 'content',
                message: 'Enter note content:',
                validate: input => input.trim() ? true : 'Content cannot be empty'
            }
        ]);

        const filePath = path.join(NOTES_DIR, `${answers.title}.txt`);
        await fs.writeFile(filePath, answers.content);
        console.log(`Note "${answers.title}" created successfully!`);
    } catch (error) {
        console.error('Error creating note:', error.message);
    }
}

/**
 * Lists all notes
 * @returns {Promise<void>}
 */
async function listNotes() {
    try {
        const files = await fs.readdir(NOTES_DIR);
        if (files.length === 0) {
            console.log('No notes found.');
            return;
        }
        console.log('\nAvailable notes:');
        files.forEach((file, index) => {
            console.log(`${index + 1}. ${path.basename(file, '.txt')}`);
        });
    } catch (error) {
        console.error('Error listing notes:', error.message);
    }
}

/**
 * Reads a specific note
 * @returns {Promise<void>}
 */
async function readNote() {
    try {
        const files = await fs.readdir(NOTES_DIR);
        if (files.length === 0) {
            console.log('No notes to read.');
            return;
        }

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'title',
                message: 'Select a note to read:',
                choices: files.map(file => path.basename(file, '.txt'))
            }
        ]);

        const filePath = path.join(NOTES_DIR, `${answers.title}.txt`);
        const content = await fs.readFile(filePath, 'utf8');
        console.log(`\nNote: ${answers.title}`);
        console.log('Content:', content);
    } catch (error) {
        console.error('Error reading note:', error.message);
    }
}

/**
 * Edits an existing note
 * @returns {Promise<void>}
 */
async function editNote() {
    try {
        const files = await fs.readdir(NOTES_DIR);
        if (files.length === 0) {
            console.log('No notes to edit.');
            return;
        }

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'title',
                message: 'Select a note to edit:',
                choices: files.map(file => path.basename(file, '.txt'))
            },
            {
                type: 'input',
                name: 'content',
                message: 'Enter new content:',
                validate: input => input.trim() ? true : 'Content cannot be empty'
            }
        ]);

        const filePath = path.join(NOTES_DIR, `${answers.title}.txt`);
        await fs.writeFile(filePath, answers.content);
        console.log(`Note "${answers.title}" updated successfully!`);
    } catch (error) {
        console.error('Error editing note:', error.message);
    }
}

/**
 * Deletes a specific note
 * @returns {Promise<void>}
 */
async function deleteNote() {
    try {
        const files = await fs.readdir(NOTES_DIR);
        if (files.length === 0) {
            console.log('No notes to delete.');
            return;
        }

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'title',
                message: 'Select a note to delete:',
                choices: files.map(file => path.basename(file, '.txt'))
            }
        ]);

        const filePath = path.join(NOTES_DIR, `${answers.title}.txt`);
        await fs.unlink(filePath);
        console.log(`Note "${answers.title}" deleted successfully!`);
    } catch (error) {
        console.error('Error deleting note:', error.message);
    }
}

/**
 * Deletes all notes
 * @returns {Promise<void>}
 */
async function deleteAllNotes() {
    try {
        const files = await fs.readdir(NOTES_DIR);
        if (files.length === 0) {
            console.log('No notes to delete.');
            return;
        }

        const answers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Are you sure you want to delete all notes?',
                default: false
            }
        ]);

        if (answers.confirm) {
            for (const file of files) {
                await fs.unlink(path.join(NOTES_DIR, file));
            }
            console.log('All notes deleted successfully!');
        } else {
            console.log('Deletion cancelled.');
        }
    } catch (error) {
        console.error('Error deleting all notes:', error.message);
    }
}

/**
 * Main CLI menu
 * @returns {Promise<void>}
 */
async function mainMenu() {
    await ensureNotesDir();

    const choices = [
        { name: '1. List all notes', value: 'list' },
        { name: '2. Read a note', value: 'read' },
        { name: '3. Create a note', value: 'create' },
        { name: '4. Edit a note', value: 'edit' },
        { name: '5. Delete a note', value: 'delete' },
        { name: '6. Delete all notes', value: 'deleteAll' },
        { name: '7. Exit', value: 'exit' }
    ];

    while (true) {
        try {
            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to do?',
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
                    console.log('Goodbye!');
                    return;
            }
        } catch (error) {
            console.error('Error in main menu:', error.message);
        }
    }
}

// Start the application
mainMenu().catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
});