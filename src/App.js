import React, { useState, useCallback } from "react";

function TodoApp() {
  const [todos, setTodos] = useState([]); // set the todolist and initialize it as empty
  const [inputValue, setInputValue] = useState(""); // set the inputValue to null
  const [filter, setFilter] = useState("all"); // set the initial filter value to "all"

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // set the input with the inputValue
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo = {
        // create a new todo object
        id: Date.now(), // assign a unique id
        text: inputValue,
        completed: false, // set completed to false initially
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]); // add the new todo to the todos list
      setInputValue(""); // reset the inputValue to an empty string
    }
  };

  const handleDeleteTodo = (id) => {  // in this function we use findIndex method to find the index of the todo with specified id
    const index = todos.findIndex((todo) => todo.id === id);
    if(index !== -1){
      const updatedTodos = [...todos];
      updatedTodos.splice(index , 1);
      setTodos(updatedTodos);
    }
  };

  // React hook that memoizes the callback function. It ensures that the callback is only recreated if any of its dependencies change. 
  const handleToggleTodo = useCallback((id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed }; // toggle the completed property of the todo
        }
        return todo;
      })
    );
  }, []); //an empty dependency array ([]) is provided, indicating that the callback doesn't depend on any external variables or props.

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

  return (
    <div>
      <h1>TodoApp</h1>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={handleAddTodo}>Add Todo</button>
      <div>
        <button onClick={() => handleFilterChange("all")}>All</button>
        <button onClick={() => handleFilterChange("completed")}>Completed</button>
        <button onClick={() => handleFilterChange("active")}>Active</button>
      </div>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
              {todo.text}
            </span>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
