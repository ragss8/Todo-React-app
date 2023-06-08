import React,{useState} from "react";

function TodoApp(){
  const [todos , setTodos] = useState([]);  //set the todolist and initialize it as empty
  const [inputValue , setInputValue] = useState(''); //set the inputValue to null

  const handleInputChange = (event) =>{
    setInputValue(event.target.value);   //set the input with the InputValue
  };

  const handelAddTodo = () => {
    if(inputValue.trim() !== ''){
      setTodos([...todos, inputValue]);  //spread list is used here to expand the todo added to the todos
      setInputValue(''); //reset the inputValue to null with this function
    }
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);
  }

  return(
    <div>
      <h1>TodoApp</h1>
      <input type="text" value={inputValue} onChange={handleInputChange}/>
      <button onClick={handelAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo,index) =>(      //we call the map function to allocate the todos to their respective indexes
          <li key={index}>{todo} <button onClick={handleDeleteTodo}>Delete</button></li>  //li has a key to map the indexs of todos added and adds a todo within
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
