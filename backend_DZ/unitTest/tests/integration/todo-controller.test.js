const inquirer = require('inquirer');
const TodoController = require('../../src/controllers/todo-controller');
const TodoService = require('../../src/services/todo-service');

jest.mock('inquirer');
jest.mock('../../src/services/todo-service');

describe('TodoController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createNote prompts and creates note', async () => {
    inquirer.prompt.mockResolvedValueOnce({ title: 'test', content: 'content' });
    TodoService.createNote.mockResolvedValue({ title: 'test', content: 'content' });
    const result = await TodoController.createNote();
    expect(result).toEqual({ title: 'test', content: 'content' });
    expect(inquirer.prompt).toHaveBeenCalled();
  });

  test('listNotes lists available notes', async () => {
    TodoService.listNotes.mockResolvedValue(['note1', 'note2']);
    const notes = await TodoController.listNotes();
    expect(notes).toEqual(['note1', 'note2']);
  });

  test('readNote prompts and reads note', async () => {
    TodoService.listNotes.mockResolvedValue(['note1']);
    inquirer.prompt.mockResolvedValueOnce({ title: 'note1' });
    TodoService.readNote.mockResolvedValue({ title: 'note1', content: 'content' });
    const result = await TodoController.readNote();
    expect(result).toEqual({ title: 'note1', content: 'content' });
  });

  test('editNote prompts and edits note', async () => {
    TodoService.listNotes.mockResolvedValue(['note1']);
    inquirer.prompt.mockResolvedValueOnce({ title: 'note1', content: 'new content' });
    TodoService.editNote.mockResolvedValue({ title: 'note1', content: 'new content' });
    const result = await TodoController.editNote();
    expect(result).toEqual({ title: 'note1', content: 'new content' });
  });

  test('deleteNote prompts and deletes note', async () => {
    TodoService.listNotes.mockResolvedValue(['note1']);
    inquirer.prompt.mockResolvedValueOnce({ title: 'note1' });
    TodoService.deleteNote.mockResolvedValue({ title: 'note1' });
    const result = await TodoController.deleteNote();
    expect(result).toEqual({ title: 'note1' });
  });

  test('deleteAllNotes prompts and deletes all notes', async () => {
    TodoService.listNotes.mockResolvedValue(['note1', 'note2']);
    inquirer.prompt.mockResolvedValueOnce({ confirm: true });
    TodoService.deleteAllNotes.mockResolvedValue({ deletedCount: 2 });
    const result = await TodoController.deleteAllNotes();
    expect(result).toEqual({ deletedCount: 2 });
  });
});