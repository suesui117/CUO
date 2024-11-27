import React, { useState, useEffect } from 'react';
import '../styles/styles.css';  // Import the CSS file

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(localStorage.getItem('user') || '');
  const [taskInput, setTaskInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  // Load todos from the backend and local storage (if available)
  const loadTodosFromBackend = () => {
    if (user) {
      fetch(`http://localhost:5001/api/todos/${user}`) // Backend URL
        .then((response) => response.json())
        .then((data) => {
          setTodos(data);  // Set the tasks for that user
          localStorage.setItem('todos', JSON.stringify(data));  // Save todos to local storage
        })
        .catch((error) => console.error('Error fetching todos:', error));
    }
  };

  useEffect(() => {
    if (isLoggedIn && user) {
      loadTodosFromBackend();  // Load todos when the component mounts
    }
  }, [isLoggedIn, user]);

  // Handle login
  const handleLogin = () => {
    if (taskInput.trim()) {
      localStorage.setItem('user', taskInput);  // Save user to localStorage
      setUser(taskInput);  // Set the user state
      setIsLoggedIn(true);  // Set logged-in state
      setTaskInput(''); // Clear the task input after login
      loadTodosFromBackend();  // Load todos for the user
    } else {
      alert('Please enter a valid username!');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');  // Remove user from localStorage
    setUser('');
    setIsLoggedIn(false);
    setTodos([]);  // Clear tasks on logout
  };

  // Add a task
  const addTodo = () => {
    const newTask = taskInput;
    if (newTask && user) {
      const newTodo = { task: newTask, completed: false };
      fetch(`http://localhost:5001/api/todos/${user}`, { // Backend URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      })
        .then((response) => response.json())
        .then((updatedTodos) => {
          setTodos(updatedTodos);  // Update the tasks after adding a new one
          localStorage.setItem('todos', JSON.stringify(updatedTodos));  // Save updated todos to local storage
          setTaskInput('');
        })
        .catch((error) => console.error('Error adding todo:', error));
    }
  };

  // Delete a task
  const deleteTodo = (taskToDelete) => {
    if (user) {
      fetch(`http://localhost:5001/api/todos/${user}/${taskToDelete}`, { // Backend URL
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((updatedTodos) => {
          setTodos(updatedTodos);  // Update the tasks after deleting a task
          localStorage.setItem('todos', JSON.stringify(updatedTodos));  // Save updated todos to local storage
        })
        .catch((error) => console.error('Error deleting todo:', error));
    }
  };

  // Toggle task completion
  const toggleComplete = async (taskToToggle) => {
    // Find the task by its unique ID
    const todoToUpdate = todos.find(todo => todo._id === taskToToggle._id); // Use _id for unique identification
    
    if (!todoToUpdate) return;  // If no task found, exit

    const updatedTodos = todos.map(todo =>
      todo._id === todoToUpdate._id  // Compare by _id, not task name
        ? { ...todo, completed: !todo.completed } // Toggle completion status
        : todo
    );

    setTodos(updatedTodos); // Update state in frontend

    // Send PATCH request to update completion status on the backend
    await fetch(`http://localhost:5001/api/todos/${user}/${todoToUpdate._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !todoToUpdate.completed }),  // Toggle completion
    });

    localStorage.setItem('todos', JSON.stringify(updatedTodos));  // Save updated todos to local storage
  };
 return (
    <div className="app-container">
      {!isLoggedIn ? (
        <div>
          <h1>Login to Your Todo Account</h1>
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Enter your username"
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h1>Todo App - Welcome, {user}</h1>
          <button onClick={handleLogout}>Logout</button>
          
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="New task"
          />
          <button onClick={addTodo}>Add Todo</button>

          <ul>
            {todos.map((todo) => (
              <li key={todo._id}>
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.task}
                </span>
                <button onClick={() => toggleComplete(todo)}>
                  {todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TodoApp;
