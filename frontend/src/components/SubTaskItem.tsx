// SubTaskItem.tsx
import { useState } from "react";
import styled from "styled-components";
import { SubTask } from "../types";
import { Button } from "./common";

interface SubTaskItemProps {
  subtask: SubTask;
  onUpdate: (subtask: SubTask) => void;
  onDelete: (id: number) => void;
}

export const SubTaskItem = ({
  subtask,
  onUpdate,
  onDelete,
}: SubTaskItemProps) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(subtask.title);

  const toggleComplete = () => {
    onUpdate({ ...subtask, completed: !subtask.completed });
  };

  const handleSave = () => {
    onUpdate({ ...subtask, title });
    setEditing(false);
  };

  return (
    <SubTaskContainer>
      <SubTaskContent>
        <input
          type="checkbox"
          checked={subtask.completed}
          onChange={toggleComplete}
        />
        {editing ? (
          <EditInput
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        ) : (
          <SubTaskTitle $completed={subtask.completed}>
            {subtask.title}
          </SubTaskTitle>
        )}
      </SubTaskContent>

      <SubTaskActions>
        <SmallButton
          onClick={() => (editing ? handleSave() : setEditing(true))}
        >
          {editing ? "완료" : "수정"}
        </SmallButton>
        <SmallButton onClick={() => onDelete(subtask.id)}>삭제</SmallButton>
      </SubTaskActions>
    </SubTaskContainer>
  );
};

const SubTaskContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  margin: 0.25rem 0;
  background-color: #f9fafb;
  border-radius: 6px;
`;

const SubTaskContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const SubTaskTitle = styled.span<{ $completed: boolean }>`
  font-size: 0.9rem;
  color: ${({ $completed }) => ($completed ? "#9ca3af" : "#4b5563")};
  text-decoration: ${({ $completed }) =>
    $completed ? "line-through" : "none"};
`;

const SubTaskActions = styled.div`
  display: flex;
  gap: 0.3rem;
`;

const SmallButton = styled(Button)`
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
`;

const EditInput = styled.input`
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  flex: 1;

  &:focus {
    border-color: #3b82f6;
    outline: none;
  }
`;
