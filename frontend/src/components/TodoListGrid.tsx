import styled from "styled-components";
import { Todo } from "../types";
import { TodoItem } from "./TodoItem";

type Props = {
  todos: Todo[];
  onUpdate: (todo: Todo) => void;
  onDelete: (id: number) => void;
};

export const TodoListGrid = ({ todos, onUpdate, onDelete }: Props) => {
  const completed = todos.filter((t) => t.status === "완료");
  const notCompleted = todos.filter((t) => t.status !== "완료");
  const all = todos;

  return (
    <GridWrapper>
      <Column>
        <h3>전체</h3>
        {all.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </Column>

      <Column>
        <h3>완료</h3>
        {completed.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </Column>

      <Column>
        <h3>미완료</h3>
        {notCompleted.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </Column>
    </GridWrapper>
  );
};

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  min-height: 300px;

  h3 {
    color: #345b82;
    text-align: center;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`;
