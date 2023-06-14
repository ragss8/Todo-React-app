import React, { useState, useCallback } from "react";
import './App.css';

function TodoApp() {
  const [todos, setTodos] = useState([]); // set the todolist and initialize it as empty
  const [inputValue, setInputValue] = useState(""); // set the inputValue to null
  const [filter, setFilter] = useState("all"); // set the initial filter value to "all"
  const [editTodo, setEditTodo] = useState(null); // set the initial editTodo value to null

  // Handler for input change event
  const handleInputChange = (event) => {
    setInputValue(event.target.value); // set the input with the inputValue
  };

  // Handler for adding a new todo
  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo = {
        id: Date.now(), // assign a unique id
        text: inputValue,
        completed: false, // set completed to false initially
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]); // add the new todo to the prevTodos list
      setInputValue(""); // reset the inputValue to an empty string
    }
  };

  // Handler for deleting a todo
  const handleDeleteTodo = (id) => {
    const index = todos.findIndex((todo) => todo.id === id); // find the index of the todo with specified id
    if (index !== -1) { // checks if the match is found with the requested index of todo.id or not
      const updatedTodos = [...todos];
      updatedTodos.splice(index, 1); // remove the todo from the todos list
      setTodos(updatedTodos);
    }
  };

  // React hook that memoizes the callback function. It ensures that the callback is only recreated if any of its dependencies change.
  const handleToggleTodo = useCallback((id) => {
    setTodos((prevTodos) =>  //first it sets the Todos list to previousTodos so that it gets the status of the todos as they are
      prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed }; // toggle the completed property of the todo
        }
        return todo;  //if its not toggled just return the todo
      })
    );
  }, []); // an empty dependency array ([]) is provided, indicating that the callback doesn't depend on any external variables or props.

  
  // Handler for changing the filter
  const handleFilterChange = (filterType) => {
    setFilter(filterType); // update the filter value
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") {
      return true; // show all todos
    } else if (filter === "completed") {
      return todo.completed; // show only completed todos
    } else if (filter === "active") {
      return !todo.completed; // show only active todos
    }
    return false;
  });

  // Handler for starting editing a todo
  const handleEditTodo = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id); // find the todo item to be edited
    setEditTodo(todoToEdit); // set the todo item as the currently edited todo
  };

  // Handler for updating the edited todo
  const handleUpdateTodo = () => {
    const updatedTodos = todos.map((todo) =>
      todo.id === editTodo.id ? editTodo : todo // replace the edited todo in the todos list
    );
    setTodos(updatedTodos); // update the todos list with the updated todo
    setEditTodo(null); // reset the editTodo to null
  };

  return (
    <div className="body">
      <div className="main" style={{textAlign:"center"}}>
      <h1 style={{fontSize:"40px"}}>TodoApp</h1>
      <input type="text" value={inputValue} onChange={handleInputChange}  style={{textAlign: "center"}}/>
      <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      <div className="container">
      <div className="button">
        <button onClick={() => handleFilterChange("all")}>All</button>
        <button onClick={() => handleFilterChange("completed")}>
          Completed
        </button>
        <button onClick={() => handleFilterChange("active")}>Active</button>
      </div>
      <div className="listItems" style={{textAlign: "revert-layer"}}>
        <h2 style={{textAlign:"center"}}>Todo-List</h2>
      <ul>
        {filteredTodos.map((todo , index) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
              className="checkbox-label"
            />
            {editTodo && editTodo.id === todo.id ? (  //it checks if the editTodo.id is really equal to the matching todo.id
              // If the todo is being edited, display an input field for editing the text
              <input
                type="text"
                value={editTodo.text}
                onChange={(event) =>
                  setEditTodo({ ...editTodo, text: event.target.value })
                }
              />
            ) : (
              // if it's not being edited display the todo text and if it's checked it has "line-through" else "none"
              <span>
               {index +1}. <b>{todo.text}</b> - {""} [{todo.completed ? "completed" : "active"}]
              </span>
            )}
            {editTodo && editTodo.id === todo.id ? (
              // If the todo is being edited, display an "Update" button for saving the changes
              <button onClick={handleUpdateTodo}>Update</button>
            ) : (
              // Otherwise, display an "Edit" button for starting the editing
              <button onClick={() => handleEditTodo(todo.id)}>Edit</button>
            )}
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      </div>
      </div>
    </div>
  );
}

export default TodoApp;
