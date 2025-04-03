import { useState } from "react";
import { Todo } from "../types";
import { formatDate } from "../utils";

export const TodoItem = ({
  todo,
  onUpdate,
  onDelete,
}: {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: number) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [dueDate, setDueDate] = useState(todo.due_date || "");

  const toggleComplete = () => {
    onUpdate({ ...todo, completed: !todo.completed });
  };

  const handleSave = () => {
    onUpdate({ ...todo, title, description, due_date: dueDate });
    setEditing(false);
  };

  return (
    <li className={todo.completed ? "completed" : ""}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleComplete}
      />

      <div className="todo-text">
        {editing ? (
          <div style={{ display: "flex", gap: 5 }}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        ) : (
          <>
            <span>{todo.title}</span>
            <span>: {todo.description}</span>
          </>
        )}
      </div>

      <div>{todo.status}</div>

      <div className="todo-due">
        {editing ? (
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        ) : (
          todo.due_date && <span>{formatDate(todo.due_date)}</span>
        )}
      </div>

      <div className="todo-actions">
        <button onClick={() => (editing ? handleSave() : setEditing(true))}>
          {editing ? "Save" : "Edit"}
        </button>
        <button onClick={() => onDelete(todo.id)}>Delete</button>
      </div>
    </li>
  );
};
