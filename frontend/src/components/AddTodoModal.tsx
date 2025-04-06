import { useState } from "react";
import { Todo } from "../types";
import { TodoForm } from "./TodoForm";
import { Button, Modal } from "./common";

export const AddTodoModal = ({ onAdd }: { onAdd: (todo: Todo) => void }) => {
  const [open, setOpen] = useState(false);

  const handleAdd = (todo: Todo) => {
    onAdd(todo);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ 할 일 추가</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <TodoForm onAdd={handleAdd} />
      </Modal>
    </>
  );
};
