import { useState, useEffect } from "react";
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  searchTodos,
} from "./api";
import { Todo } from "./types";
import { AddTodoModal, Dashboard, SearchBar, TodoListGrid } from "./components";
import "./App.css";
import { styled } from "styled-components";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const loadTodos = async () => {
    const data = await fetchTodos();
    setTodos(data);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleSearch = async (query: string) => {
    const results = await searchTodos(query);
    setTodos(results);
  };

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
      <TodoListHeader>
        <SearchBar onSearch={handleSearch} />
        <AddTodoModal onAdd={handleAdd} />
      </TodoListHeader>
      <Dashboard />
      <TodoListGrid
        todos={todos}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}

const TodoListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export default App;
