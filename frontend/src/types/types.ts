export type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  due_date: string | null;
  status: "시작 전" | "진행 중" | "완료";
};
