const fs = require('fs').promises;
const path = require('path');

const NOTES_DIR = path.join(__dirname, '../../notes');

class TodoService {
  async ensureNotesDir() {
    try {
      await fs.mkdir(NOTES_DIR, { recursive: true });
    } catch (error) {
      throw new Error(`Ошибка при создании директории: ${error.message}`);
    }
  }

  async createNote(title, content) {
    if (!title.trim() || !content.trim()) {
      throw new Error('Название и содержимое не могут быть пустыми');
    }
    const filePath = path.join(NOTES_DIR, `${title}.txt`);
    await fs.writeFile(filePath, content);
    return { title, content };
  }

  async listNotes() {
    const files = await fs.readdir(NOTES_DIR);
    return files.map(file => path.basename(file, '.txt'));
  }

  async readNote(title) {
    const filePath = path.join(NOTES_DIR, `${title}.txt`);
    const content = await fs.readFile(filePath, 'utf8');
    return { title, content };
  }

  async editNote(title, content) {
    if (!content.trim()) {
      throw new Error('Содержимое не может быть пустым');
    }
    const filePath = path.join(NOTES_DIR, `${title}.txt`);
    await fs.writeFile(filePath, content);
    return { title, content };
  }

  async deleteNote(title) {
    const filePath = path.join(NOTES_DIR, `${title}.txt`);
    await fs.unlink(filePath);
    return { title };
  }

  async deleteAllNotes() {
    const files = await fs.readdir(NOTES_DIR);
    for (const file of files) {
      await fs.unlink(path.join(NOTES_DIR, file));
    }
    return { deletedCount: files.length };
  }
}

module.exports = new TodoService();