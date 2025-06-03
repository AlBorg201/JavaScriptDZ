const fs = require('fs/promises');
const path = require('path');
const TodoService = require('../../src/services/todo-service');

jest.mock('fs/promises');

describe('TodoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('ensureNotesDir creates directory', async () => {
    fs.mkdir.mockResolvedValue();
    await TodoService.ensureNotesDir();
    expect(fs.mkdir).toHaveBeenCalledWith(expect.any(String), { recursive: true });
  });

  test('createNote creates a note', async () => {
    fs.writeFile.mockResolvedValue();
    const note = await TodoService.createNote('test', 'content');
    expect(note).toEqual({ title: 'test', content: 'content' });
    expect(fs.writeFile).toHaveBeenCalledWith(expect.any(String), 'content');
  });

  test('createNote throws error on empty input', async () => {
    await expect(TodoService.createNote('', '')).rejects.toThrow('Название и содержимое не могут быть пустыми');
  });

  test('listNotes returns note titles', async () => {
    fs.readdir.mockResolvedValue(['note1.txt', 'note2.txt']);
    const notes = await TodoService.listNotes();
    expect(notes).toEqual(['note1', 'note2']);
  });

  test('readNote reads note content', async () => {
    fs.readFile.mockResolvedValue('content');
    const note = await TodoService.readNote('test');
    expect(note).toEqual({ title: 'test', content: 'content' });
  });

  test('editNote updates note content', async () => {
    fs.writeFile.mockResolvedValue();
    const note = await TodoService.editNote('test', 'new content');
    expect(note).toEqual({ title: 'test', content: 'new content' });
  });

  test('deleteNote removes note', async () => {
    fs.unlink.mockResolvedValue();
    const result = await TodoService.deleteNote('test');
    expect(result).toEqual({ title: 'test' });
  });

  test('deleteAllNotes removes all notes', async () => {
    fs.readdir.mockResolvedValue(['note1.txt', 'note2.txt']);
    fs.unlink.mockResolvedValue();
    const result = await TodoService.deleteAllNotes();
    expect(result).toEqual({ deletedCount: 2 });
  });
});