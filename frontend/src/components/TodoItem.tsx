import { useState } from "react";
import { Priority, Todo } from "../types";
import { formatDate } from "../utils";
import { Button } from "./common";
import styled from "styled-components";

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
  const [priority, setPriority] = useState<Priority | null>(
    todo.priority || null
  );

  const toggleComplete = () => {
    const newStatus = todo.status === "완료" ? "진행 중" : "완료";
    onUpdate({ ...todo, status: newStatus });
  };

  const handleSave = () => {
    onUpdate({ ...todo, title, description, due_date: dueDate, priority });
    setEditing(false);
  };

  return (
    <Card $completed={todo.status === "완료"}>
      <TopRow>
        <input
          type="checkbox"
          checked={todo.status === "완료"}
          onChange={toggleComplete}
        />
        <TitleBlock>
          {editing ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <EditInput
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <EditInput
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          ) : (
            <>
              <h4>{todo.title}</h4>
              <p>{todo.description}</p>
            </>
          )}
        </TitleBlock>
      </TopRow>

      <Meta>
        <span>{todo.status}</span>
        {editing ? (
          <EditInput
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        ) : (
          todo.due_date && <span>{formatDate(todo.due_date)}</span>
        )}
      </Meta>

      {editing ? (
        <PrioritySelect>
          <label>우선순위:</label>
          <select
            value={priority || ""}
            onChange={(e) => {
              setPriority(
                e.target.value === "" ? null : (e.target.value as Priority)
              );
            }}
          >
            <option value="">없음</option>
            <option value={Priority.high}>{Priority.high}</option>
            <option value={Priority.medium}>{Priority.medium}</option>
            <option value={Priority.low}>{Priority.low}</option>
          </select>
        </PrioritySelect>
      ) : (
        <>{priority}</>
      )}

      <Actions>
        <Button onClick={() => (editing ? handleSave() : setEditing(true))}>
          {editing ? "완료" : "수정"}
        </Button>
        <Button onClick={() => onDelete(todo.id)}>삭제</Button>
      </Actions>
    </Card>
  );
};

const Card = styled.li<{ $completed: boolean }>`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-left: 5px solid
    ${({ $completed }) => ($completed ? "#10b981" : "#3b82f6")};
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
`;

const TopRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const TitleBlock = styled.div`
  flex: 1;

  h4 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #111827;
  }

  p {
    margin: 0.25rem 0 0 0;
    color: #6b7280;
    font-size: 0.95rem;
  }
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditInput = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  width: 100%;

  &:focus {
    border-color: #3b82f6;
    outline: none;
  }
`;

const PrioritySelect = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;

  label {
    font-size: 0.9rem;
    color: #374151;
  }

  select {
    padding: 0.5rem;
    font-size: 0.9rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    color: #374151;
    background-color: white;
    outline: none;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }
  }
`;
