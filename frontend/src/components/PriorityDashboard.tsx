import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchTodosByPriority } from "../api";
import { Todo, Priority } from "../types";

export const PriorityDashboard = () => {
  const [selectedPriority, setSelectedPriority] = useState<Priority>(
    Priority.high
  );
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (selectedPriority) {
      fetchTodosByPriority(selectedPriority).then(setTodos);
    } else {
      setTodos([]);
    }
  }, [selectedPriority]);

  const handlePriorityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPriority(event.target.value as Priority);
  };

  return (
    <Container>
      <h2>우선순위별 모아보기</h2>
      <PrioritySelector>
        <label htmlFor="priority">우선순위 선택:</label>
        <select
          id="priority"
          value={selectedPriority}
          onChange={handlePriorityChange}
        >
          <option value={Priority.high}>{Priority.high}</option>
          <option value={Priority.medium}>{Priority.medium}</option>
          <option value={Priority.low}>{Priority.low}</option>
        </select>
      </PrioritySelector>

      {todos.map((todo) => (
        <TodoCard key={todo.id} $completed={todo.status === "완료"}>
          <Title>{todo.title}</Title>
          <Description>{todo.description}</Description>
          <Meta>
            <span>{todo.status}</span>
            {todo.due_date && <span>{todo.due_date}</span>}
          </Meta>
        </TodoCard>
      ))}

      {todos.length === 0 && (
        <p>선택한 우선순위에 해당하는 To-Do가 없습니다.</p>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin-top: 4rem;
  margin-bottom: 2rem;
`;

const PrioritySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  label {
    font-weight: bold;
  }

  select {
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
`;

const TodoCard = styled.div<{ $completed: boolean }>`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-left: 5px solid
    ${({ $completed }) => ($completed ? "#10b981" : "#3b82f6")};
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 300px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
`;

const Title = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
`;

const Description = styled.p`
  margin: 0.25rem 0 0 0;
  color: #6b7280;
  font-size: 0.95rem;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
`;
