import React,{useState} from "react";

function TodoApp(){
  const [todos , setTodos] = useState([]);
  const [inputValue , setInputValue] = useState('');

  const handleInputChange = (event) =>{
    setInputValue(event.target.value);
  };

  const handelAddTodo = () => {
    if(inputValue.trim() !== ''){
      setTodos([...todos, inputValue]);
      setInputValue('');
    }
  };

  return(
    <div>
      <h1>TodoApp</h1>
      <input type="text" value={inputValue} onChange={handleInputChange}/>
      <button onClick={handelAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo,index) =>(
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;