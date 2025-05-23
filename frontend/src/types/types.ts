export type Todo = {
  id: number;
  title: string;
  description: string;
  due_date: string | null;
  status: "시작 전" | "진행 중" | "완료";
  priority?: Priority | null;
};

export type TodoStats = {
  total: number;
  completed: number;
  not_completed: number;
};

export enum Priority {
  high = "높음",
  medium = "중간",
  low = "낮음",
}

export type SubTask = {
  id: number;
  title: string;
  completed: boolean;
};
