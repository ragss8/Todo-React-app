import React, { useState } from "react";

function TodoApp() {
  const [todos, setTodos] = useState([]);  //set the todolist and initialize it as empty
  const [inputValue, setInputValue] = useState(""); //set the inputValue to null
  const [completedTodo, setCompletedTodo] = useState([]);
  const [filter, setFilter] = useState("all");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);   //set the input with the InputValue
  };

  const handelAddTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo = {
        text: inputValue,
        completed: false,         //here complete is set to false as it is not set
      };
      setTodos([...todos, newTodo]);  //spread list is used here to expand the todo added to the todos
      setInputValue(''); //reset the inputValue to null with this function
    }
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);
  };

  const handleToggleTodo = (index) => {
    const updatedTodos = [...todos];      //we just mutate and put the todos into the updated Todos list
    updatedTodos[index] = {
      ...updatedTodos[index],  //Creates a new object by spreading the properties of the existing todo item and updating the completed property 
      completed: !updatedTodos[index].completed, //We toggle the completed property by negating its current value using !.
    };

    if (updatedTodos[index].completed) {   //if that index of updatedTodos list is checked it is inserted into setCompletedTodo list 
      setCompletedTodo([...completedTodo, updatedTodos[index]]);  //we add it to the completedTodos array by spreading the existing completed todos and adding the updated todo item.
    } else {
      const filteredcompletedTodos = completedTodo.filter(
        (todo) => todo !== updatedTodos[index]
      );
      setCompletedTodo(filteredcompletedTodos);
    }
    setTodos(updatedTodos);
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  return (
    <div>
      <h1>TodoApp</h1>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={handelAddTodo}>Add Todo</button>
      <div>
        <button onClick={() => handleFilterChange("all")}>All</button>
        <button onClick={() => handleFilterChange("completed")}>completed</button>
        <button onClick={() => handleFilterChange("active")}>Active</button>
      </div>
      <ul>
        {todos.map((todo, index) => {
          if (
            filter === "all" ||
            (filter === "completed" && todo.completed) ||
            (filter === "active" && !todo.completed)
          ) {
            return (
              <li key={index}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(index)}
                />
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  {todo.text}
                </span>
                <button onClick={() => handleDeleteTodo(index)}>Delete</button>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}

export default TodoApp
