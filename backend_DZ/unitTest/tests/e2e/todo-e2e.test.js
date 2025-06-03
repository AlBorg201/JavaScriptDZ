const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs/promises');

jest.mock('fs/promises');

describe('Todo API E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/notes creates a note', async () => {
    fs.writeFile.mockResolvedValue();
    const response = await request(app)
      .post('/api/notes')
      .send({ title: 'test', content: 'content' });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ title: 'test', content: 'content' });
  });

  test('GET /api/notes lists notes', async () => {
    fs.readdir.mockResolvedValue(['note1.txt', 'note2.txt']);
    const response = await request(app).get('/api/notes');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(['note1', 'note2']);
  });

  test('GET /api/notes/:title reads a note', async () => {
    fs.readFile.mockResolvedValue('content');
    const response = await request(app).get('/api/notes/test');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ title: 'test', content: 'content' });
  });

  test('PUT /api/notes/:title edits a note', async () => {
    fs.writeFile.mockResolvedValue();
    const response = await request(app)
      .put('/api/notes/test')
      .send({ content: 'new content' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ title: 'test', content: 'new content' });
  });

  test('DELETE /api/notes/:title deletes a note', async () => {
    fs.unlink.mockResolvedValue();
    const response = await request(app).delete('/api/notes/test');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ title: 'test' });
  });

  test('DELETE /api/notes deletes all notes', async () => {
    fs.readdir.mockResolvedValue(['note1.txt', 'note2.txt']);
    fs.unlink.mockResolvedValue();
    const response = await request(app).delete('/api/notes');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ deletedCount: 2 });
  });
});