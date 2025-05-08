import axios from "axios";
import { Priority, Todo, TodoStats } from "../types";

const API_BASE = `${process.env.REACT_APP_API_URL}/todos`;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchTodos(): Promise<Todo[]> {
  const res = await api.get<Todo[]>("/");
  return res.data;
}

export async function addTodo(todo: Todo): Promise<void> {
  await api.post("/", todo);
}

export async function updateTodo(todo: Todo): Promise<void> {
  await api.put(`/${todo.id}`, todo);
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/${id}`);
}

export async function searchTodos(query = ""): Promise<Todo[]> {
  const params: Record<string, string> = {};
  if (query) params.query = query;
  const res = await api.get<Todo[]>("/search", { params });
  return res.data;
}

export async function fetchTodoStats(): Promise<TodoStats> {
  const res = await api.get<TodoStats>("/stats");
  return res.data;
}

export async function fetchTodosByPriority(
  priority: Priority
): Promise<Todo[]> {
  const res = await api.get<Todo[]>(`/priority/${priority}`);
  return res.data;
}
