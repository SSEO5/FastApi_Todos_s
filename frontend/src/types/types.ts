export type Todo = {
  id: number;
  title: string;
  description: string;
  due_date: string | null;
  status: "시작 전" | "진행 중" | "완료";
};

export type TodoStats = {
  total: number;
  completed: number;
  not_completed: number;
};
