import { useState } from "react";
import { Todo } from "../types";

export const TodoForm = ({ onAdd }: { onAdd: (todo: Todo) => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<Todo["status"]>("시작 전");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Date.now(),
      title,
      description,
      completed: false,
      due_date: dueDate || null,
      status: status,
    });
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as Todo["status"])}
      >
        <option value="시작 전">시작 전</option>
        <option value="진행 중">진행 중</option>
        <option value="완료">완료</option>
      </select>

      <button type="submit">Add To-Do</button>
    </form>
  );
};
