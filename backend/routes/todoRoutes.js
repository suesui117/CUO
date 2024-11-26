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

// Route to update a todo's task or completion status for a user
router.patch('/:user/:todoId', async (req, res) => {
  const { task, completed } = req.body;  // Extract task and completed from the body

  try {
    // Find the todo by its ID
    const todo = await Todo.findById(req.params.todoId);
    
    if (!todo) {
      return res.status(404).send('Todo not found');
    }

    // If task is provided, update the task name
    if (task) todo.task = task;

    // If completed is provided, update the completion status
    if (completed !== undefined) todo.completed = completed;

    // Save the updated todo item
    await todo.save();

    // Find all todos for the user and return them
    const todos = await Todo.find({ user: req.params.user });
    res.json(todos);  // Return all the todos of the user, including the updated one
  } catch (error) {
    res.status(500).send('Error updating todo');
  }
});


module.exports = router;
