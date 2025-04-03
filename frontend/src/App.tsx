import { useState, useEffect } from "react";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "./api";
import { Todo } from "./types";
import { TodoForm, TodoItem } from "./components";
import "./App.css";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const loadTodos = async () => {
    const data = await fetchTodos();
    setTodos(data);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async (todo: Todo) => {
    await addTodo(todo);
    loadTodos();
  };

  const handleUpdate = async (todo: Todo) => {
    await updateTodo(todo);
    loadTodos();
  };

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    loadTodos();
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <TodoForm onAdd={handleAdd} />
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
