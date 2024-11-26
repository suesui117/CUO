import React, { useEffect, useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState('');

  // Fetch todos from the backend for the user
  const loadTodosFromBackend = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      fetch(`http://localhost:5001/api/todos/${savedUser}`) // Backend URL
        .then((response) => response.json())
        .then((data) => {
          setUser(savedUser);
          setTodos(data);  // Set the tasks for that user
        })
        .catch((error) => console.error('Error fetching todos:', error));
    }
  };

  useEffect(() => {
    loadTodosFromBackend();  // Load todos when the component mounts
  }, []);

  // Add a task
  const addTodo = () => {
    const newTask = document.getElementById('taskInput').value;
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
        })
        .catch((error) => console.error('Error adding todo:', error));
      document.getElementById('taskInput').value = ''; // Clear input field
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
        })
        .catch((error) => console.error('Error deleting todo:', error));
    }
  };

  // Toggle task completion
  const toggleComplete = async (taskToToggle) => {
    // Toggle completion in frontend state
    const updatedTodos = todos.map(todo =>
      todo.task === taskToToggle
        ? { ...todo, completed: !todo.completed }
        : todo
    );
  
    setTodos(updatedTodos); // Update state in frontend
  
    // Send a PATCH request to update completion status in backend
    const todoToUpdate = todos.find(todo => todo.task === taskToToggle);
    
    await fetch(`http://localhost:5001/api/todos/${user}/${todoToUpdate._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: todoToUpdate.completed }),
    });
  };
  

  // Login function
  const login = () => {
    const username = document.getElementById('usernameInput').value;
    if (username) {
      localStorage.setItem('user', username); // Save the username
      setUser(username);
      loadTodosFromBackend();  // Load tasks for that user from the backend
    } else {
      alert('Please enter a username');
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser('');
    setTodos([]);  // Clear the tasks after logout
  };

  return (
    <div>
      <h1>Todo App</h1>
      {!user ? (
        <div>
          <input id="usernameInput" type="text" placeholder="Enter username" />
          <button onClick={login}>Log In</button>
        </div>
      ) : (
        <div>
          <p>Welcome, {user}!</p>
          <button onClick={logout}>Log Out</button>
        </div>
      )}

      {/* Todo input and tasks */}
      {user && (
        <>
          <input id="taskInput" type="text" placeholder="Enter a new task" />
          <button onClick={addTodo}>Add Task</button>
          <ul>
            {todos.map((todo, index) => (
              <li
                key={index}
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                }}
              >
                {todo.task}
                <button onClick={() => toggleComplete(todo.task)}>
                  {todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button onClick={() => deleteTodo(todo.task)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default TodoApp;
