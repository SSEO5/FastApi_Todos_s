import { useState } from "react";
import styled from "styled-components";
import { Priority, Todo } from "../types";
import { Button } from "./common";

export const TodoForm = ({ onAdd }: { onAdd: (todo: Todo) => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<Todo["status"]>("시작 전");
  const [priority, setPriority] = useState<Priority | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Date.now(),
      title,
      description,
      due_date: dueDate || null,
      status,
      priority,
    });
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority(null);
  };

  return (
    <Card onSubmit={handleSubmit}>
      <Field>
        <Label>제목</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Field>

      <Field>
        <Label>설명</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Field>
      <Field>
        <Label>마감일</Label>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </Field>

      <Field>
        <Label>상태</Label>
        <StatusButtons>
          {["시작 전", "진행 중", "완료"].map((s) => (
            <StatusButton
              key={s}
              active={status === s}
              onClick={() => setStatus(s as Todo["status"])}
              type="button"
            >
              {s}
            </StatusButton>
          ))}
        </StatusButtons>
      </Field>

      <Field>
        <Label>우선순위</Label>
        <Select
          value={priority || ""}
          onChange={(e) => setPriority(e.target.value as Priority | null)}
        >
          <option value="">없음</option>
          <option value={Priority.high}>{Priority.high}</option>
          <option value={Priority.medium}>{Priority.medium}</option>
          <option value={Priority.low}>{Priority.low}</option>
        </Select>
      </Field>

      <ButtonWrapper>
        <Button type="submit">추가</Button>
      </ButtonWrapper>
    </Card>
  );
};

const Card = styled.form`
  padding: 2rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const StatusButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StatusButton = styled.button<{ active: boolean }>`
  padding: 0.7rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${({ active }) => (active ? "#3b82f6" : "#f3f4f6")};
  color: ${({ active }) => (active ? "white" : "#374151")};
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${({ active }) => (active ? "#306bc9" : "#e5e7eb")};
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  color: #374151;
  background-color: white;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;
