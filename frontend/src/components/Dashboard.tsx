import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchTodoStats } from "../api";
import { TodoStats } from "../types";

export const Dashboard = () => {
  const [stats, setStats] = useState<TodoStats>({
    total: 0,
    completed: 0,
    not_completed: 0,
  });

  useEffect(() => {
    fetchTodoStats().then(setStats);
  }, []);

  return (
    <Container>
      <StatCard>
        <Count>{stats.total}</Count>
        <Label>전체</Label>
      </StatCard>
      <StatCard>
        <Count>{stats.completed}</Count>
        <Label>완료</Label>
      </StatCard>
      <StatCard>
        <Count>{stats.not_completed}</Count>
        <Label>미완료</Label>
      </StatCard>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  background-color: #f8fafc;
`;

const Count = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
`;

const Label = styled.div`
  font-size: 1rem;
  margin-top: 0.5rem;
  color: #6b7280;
`;
