// SubTaskList.tsx
import { useState } from "react";
import styled from "styled-components";
import { SubTask } from "../types";
import { SubTaskItem } from "./SubTaskItem";
import { Button } from "./common";

interface SubTaskListProps {
  todoId: number;
  subtasks: SubTask[];
  onAddSubtask: (todoId: number, subtask: SubTask) => void;
  onUpdateSubtask: (
    todoId: number,
    subtaskId: number,
    subtask: SubTask
  ) => void;
  onDeleteSubtask: (todoId: number, subtaskId: number) => void;
}

export const SubTaskList = ({
  todoId,
  subtasks,
  onAddSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
}: SubTaskListProps) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;

    const newSubtask: SubTask = {
      id: Date.now(), // 임시 ID, 서버에서 실제 ID를 할당할 것입니다
      title: newSubtaskTitle,
      completed: false,
    };

    onAddSubtask(todoId, newSubtask);
    setNewSubtaskTitle("");
  };

  return (
    <Container>
      <h5>서브태스크 ({subtasks.length})</h5>

      <AddSubTaskForm>
        <EditInput
          type="text"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          placeholder="새 서브태스크 추가..."
          onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
        />
        <Button onClick={handleAddSubtask}>추가</Button>
      </AddSubTaskForm>

      <SubTasksContainer>
        {subtasks.length === 0 ? (
          <EmptyMessage>서브태스크가 없습니다</EmptyMessage>
        ) : (
          subtasks.map((subtask) => (
            <SubTaskItem
              key={subtask.id}
              subtask={subtask}
              onUpdate={(updatedSubtask) =>
                onUpdateSubtask(todoId, subtask.id, updatedSubtask)
              }
              onDelete={(subtaskId) => onDeleteSubtask(todoId, subtaskId)}
            />
          ))
        )}
      </SubTasksContainer>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 0.5rem;

  h5 {
    margin: 0 0 0.5rem 0;
    font-size: 0.95rem;
    color: #374151;
  }
`;

const AddSubTaskForm = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const EditInput = styled.input`
  padding: 0.5rem;
  font-size: 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  flex: 1;

  &:focus {
    border-color: #3b82f6;
    outline: none;
  }
`;

const SubTasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const EmptyMessage = styled.div`
  color: #9ca3af;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
`;
