import axios from "axios";
import { Priority, Todo, TodoStats, SubTask } from "../types";

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

export async function fetchSubtasks(todoId: number): Promise<SubTask[]> {
  const res = await api.get<SubTask[]>(`/${todoId}/subtasks`);
  return res.data;
}

export async function addSubtask(
  todoId: number,
  subtask: SubTask
): Promise<SubTask> {
  const res = await api.post<SubTask>(`/${todoId}/subtasks`, subtask);
  return res.data;
}

export async function updateSubtask(
  todoId: number,
  subtaskId: number,
  subtask: SubTask
): Promise<SubTask> {
  const res = await api.put<SubTask>(
    `/${todoId}/subtasks/${subtaskId}`,
    subtask
  );
  return res.data;
}

export async function deleteSubtask(
  todoId: number,
  subtaskId: number
): Promise<void> {
  await api.delete(`/${todoId}/subtasks/${subtaskId}`);
}

export async function toggleSubtaskCompletion(
  todoId: number,
  subtaskId: number,
  subtask: SubTask
): Promise<SubTask> {
  const updatedSubtask = { ...subtask, completed: !subtask.completed };
  return updateSubtask(todoId, subtaskId, updatedSubtask);
}
