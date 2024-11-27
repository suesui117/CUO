const express = require('express');
const Todo = require('../models/Todo'); // Corrected import path
const router = express.Router();

// Route to get all todos for a user
router.get('/:user', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.params.user });
    res.json(todos);
  } catch (error) {
    res.status(500).send('Error fetching todos');
  }
});

// Route to add a new todo for a user
router.post('/:user', async (req, res) => {
  try {
    const newTodo = new Todo({
      task: req.body.task,
      completed: req.body.completed,
      user: req.params.user, // Save the user associated with the todo
    });
    await newTodo.save();
    const todos = await Todo.find({ user: req.params.user });
    res.json(todos); // Send the updated todos back to frontend
  } catch (error) {
    res.status(500).send('Error adding todo');
  }
});

// Route to delete a todo for a user
router.delete('/:user/:todoId', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.todoId);
    const todos = await Todo.find({ user: req.params.user });
    res.json(todos); // Send the updated todos back to frontend
  } catch (error) {
    res.status(500).send('Error deleting todo');
  }
});

// Route to update a todo's completion status for a user (this is your PATCH route)
router.patch('/:user/:todoId', async (req, res) => {
  try {
    // Find the todo by its ID and update the completion status
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.todoId,
      { completed: req.body.completed }, // Update the completed field
      { new: true } // Return the updated document
    );

    // Respond with the updated todo
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).send('Error updating todo');
  }
});

module.exports = router;
