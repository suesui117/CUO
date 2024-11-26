const mongoose = require('mongoose');

// Define the schema for a Todo
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: String, required: true },  // Added user field to associate todos with a specific user
});

// Define the model using the schema
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
