import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [editTodo, setEditTodo] = useState(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = async () => {
    if (inputValue.trim() !== "") {
      const newTodo = {
        item_text: inputValue,
        completed: false,
      };

      try {
        const response = await axios.post("http://localhost:8000/todos", newTodo);
        const addedTodo = response.data;
        setTodos((prevTodos) => [...prevTodos, addedTodo]);
        setInputValue("");
        console.log(`Todo added with ID: ${addedTodo.todo_id}`);
      } catch (error) {
        if (error.response) {
          console.log("Error", error.message);
        }
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (editTodo) {
        handleUpdateTodo();
      } else {
        handleAddTodo();
      }
    }
  };

  const handleDeleteTodo = async (todo_id, item_text) => {
    const confirmationMessage = `Are you sure you want to delete todo with ID: ${todo_id} and item text: ${item_text}?`;

    if (window.confirm(confirmationMessage)) {
      try {
        const response = await axios.delete(`http://localhost:8000/todos/${todo_id}`);
        if (response.data.message === "Todo deleted successfully") {
          setTodos((prevTodos) =>
            prevTodos.filter((todo) => todo.todo_id !== todo_id)
          );
          console.log("Item deleted successfully");
        } else {
          console.log("Todo not found");
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  const handleEditTodo = (todo_id) => {
    setEditTodo(todo_id);
  };

  const handleUpdateTodo = () => {
    if (!editTodo) {
      console.log("No todo to update");
      return;
    }

    // Find the todo with the matching todo_id
    const todoToEdit = todos.find((todo) => todo.todo_id === editTodo);

    if (!todoToEdit) {
      console.error(`Todo with ID ${editTodo} not found`);
      return;
    }

    axios
      .put(`http://localhost:8000/todos/${editTodo}`, todoToEdit)
      .then((response) => {
        const { message } = response.data;
        if (message === "Todo updated successfully") {
          const updatedTodos = todos.map((todo) =>
            todo.todo_id === editTodo ? todoToEdit : todo
          );
          setTodos(updatedTodos);
          setEditTodo(null);
          console.log(message);
        } else {
          console.log("Todo not found or update failed");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleToggleTodo = async (todo_id) => {
    try {
      const response = await axios.put(`http://localhost:8000/todos/${todo_id}/toggle`);
      setTodos((prevTodos) =>
        prevTodos.map((todo) => {
          if (todo.todo_id === todo_id) {
            return { ...todo, completed: !todo.completed };
          }
          return todo;
        })
      );
      console.log(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") {
      return true;
    } else if (filter === "completed") {
      return todo.completed;
    } else if (filter === "active") {
      return !todo.completed;
    }
    return false;
  });

  return (
    <div className="body">
      <div className="main" style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "40px" }}>TodoApp</h1>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ textAlign: "center" }}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      <div className="container">
        <div className="button">
          <button onClick={() => handleFilterChange("all")}>All</button>
          <button onClick={() => handleFilterChange("completed")}>Completed</button>
          <button onClick={() => handleFilterChange("active")}>Active</button>
        </div>
        <div className="listItems" style={{ textAlign: "revert-layer" }}>
          <h2 style={{ textAlign: "center" }}>Todo-List</h2>
          <ol>
            {filteredTodos.map((todo) => (
              <li key={todo.todo_id} data-todo-id={todo.todo_id}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.todo_id)}
                  className="checkbox-label"
                />
                {editTodo === todo.todo_id ? (
                  <input
                    type="text"
                    value={todo.item_text}
                    onChange={(event) =>
                      setTodos((prevTodos) =>
                        prevTodos.map((t) =>
                          t.todo_id === todo.todo_id
                            ? { ...t, item_text: event.target.value }
                            : t
                        )
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleUpdateTodo();
                      }
                    }}
                  />
                ): (
                  <span>
                    {todo.item_text} - [{todo.completed ? "completed" : "active"}]{" "}
                    <span style={{ display: "none" }}>{todo.todo_id}</span>
                  </span>
                )}
                {editTodo === todo.todo_id ? (
                  <button onClick={handleUpdateTodo}>Update</button>
                ) : (
                  <button onClick={() => handleEditTodo(todo.todo_id)}>Edit</button>
                )}
                <button onClick={() => handleDeleteTodo(todo.todo_id, todo.item_text)}>
                  Delete
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;

