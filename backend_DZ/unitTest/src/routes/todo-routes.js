const express = require('express');
const router = express.Router();
const TodoService = require('../services/todo-service');

router.post('/notes', async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await TodoService.createNote(title, content);
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/notes', async (req, res) => {
  try {
    const notes = await TodoService.listNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/notes/:title', async (req, res) => {
  try {
    const note = await TodoService.readNote(req.params.title);
    res.json(note);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/notes/:title', async (req, res) => {
  try {
    const { content } = req.body;
    const note = await TodoService.editNote(req.params.title, content);
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/notes/:title', async (req, res) => {
  try {
    const note = await TodoService.deleteNote(req.params.title);
    res.json(note);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete('/notes', async (req, res) => {
  try {
    const result = await TodoService.deleteAllNotes();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;