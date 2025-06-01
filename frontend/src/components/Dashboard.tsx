import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  fetchDashboardData,
  fetchCompletionTrend,
  fetchPriorityCompletion,
  fetchMonthlyStats,
  fetchDueAlerts,
} from "../api";
import {
  DashboardData,
  CompletionTrend,
  PriorityCompletion,
  DueAlerts,
  Todo,
  MonthlyStats,
} from "../types";

export const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData()
      .then(setDashboardData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner>로딩 중...</LoadingSpinner>;
  if (!dashboardData)
    return <ErrorMessage>데이터를 불러올 수 없습니다.</ErrorMessage>;

  return (
    <DashboardContainer>
      <SummarySection>
        <StatCard>
          <Count>{dashboardData.summary.total}</Count>
          <Label>전체 할일</Label>
        </StatCard>
        <StatCard>
          <Count>{dashboardData.summary.completed}</Count>
          <Label>완료</Label>
        </StatCard>
        <StatCard>
          <Count>{dashboardData.summary.in_progress}</Count>
          <Label>진행 중</Label>
        </StatCard>
        <StatCard>
          <Count>{dashboardData.summary.not_started}</Count>
          <Label>시작 전</Label>
        </StatCard>
        <StatCard highlight>
          <Count>{dashboardData.summary.completion_rate}%</Count>
          <Label>완료율</Label>
        </StatCard>
      </SummarySection>

      <ChartsSection>
        <CompletionTrendChart />
        <PriorityCompletionChart />
      </ChartsSection>

      <AlertsSection>
        <DueAlertsWidget />
        <RecentActivityWidget recentActivity={dashboardData.recent_activity} />
      </AlertsSection>

      <StatsSection>
        <MonthlyStatsChart />
      </StatsSection>
    </DashboardContainer>
  );
};

// 완료율 추이 차트 컴포넌트
export const CompletionTrendChart = () => {
  const [trendData, setTrendData] = useState<CompletionTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletionTrend()
      .then(setTrendData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ChartLoading>차트 로딩 중...</ChartLoading>;

  return (
    <ChartContainer>
      <ChartTitle>완료율 추이 (최근 30일)</ChartTitle>
      <TrendChart>
        {trendData.slice(-7).map((item, index) => (
          <TrendBar key={item.date}>
            <BarFill height={item.completion_rate} />
            <BarLabel>{item.completion_rate}%</BarLabel>
            <DateLabel>
              {new Date(item.date).getMonth() + 1}/
              {new Date(item.date).getDate()}
            </DateLabel>
          </TrendBar>
        ))}
      </TrendChart>
    </ChartContainer>
  );
};

// 우선순위별 완료율 컴포넌트
export const PriorityCompletionChart = () => {
  const [priorityData, setPriorityData] = useState<PriorityCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPriorityCompletion()
      .then(setPriorityData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ChartLoading>차트 로딩 중...</ChartLoading>;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "높음":
        return "#ef4444";
      case "중간":
        return "#f59e0b";
      case "낮음":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <ChartContainer>
      <ChartTitle>우선순위별 완료율</ChartTitle>
      <PriorityChart>
        {priorityData.map((item) => (
          <PriorityItem key={item.priority}>
            <PriorityInfo>
              <PriorityName color={getPriorityColor(item.priority)}>
                {item.priority}
              </PriorityName>
              <PriorityStats>
                {item.completed}/{item.total}
              </PriorityStats>
            </PriorityInfo>
            <ProgressBarContainer>
              <ProgressBar
                width={item.completion_rate}
                color={getPriorityColor(item.priority)}
              />
            </ProgressBarContainer>
            <PercentageText>{item.completion_rate}%</PercentageText>
          </PriorityItem>
        ))}
      </PriorityChart>
    </ChartContainer>
  );
};

// 마감일 알림 위젯
export const DueAlertsWidget = () => {
  const [alerts, setAlerts] = useState<DueAlerts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDueAlerts()
      .then(setAlerts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ChartLoading>알림 로딩 중...</ChartLoading>;
  if (!alerts) return null;

  return (
    <AlertContainer>
      <ChartTitle>마감일 알림</ChartTitle>

      {alerts.overdue.length > 0 && (
        <AlertSection>
          <AlertTitle danger>🚨 연체 ({alerts.overdue.length}개)</AlertTitle>
          {alerts.overdue.slice(0, 3).map((todo) => (
            <AlertItem key={todo.id} danger>
              <AlertText>{todo.title}</AlertText>
              <AlertBadge danger>{todo.days_overdue}일 연체</AlertBadge>
            </AlertItem>
          ))}
        </AlertSection>
      )}

      {alerts.today.length > 0 && (
        <AlertSection>
          <AlertTitle warning>
            ⏰ 오늘 마감 ({alerts.today.length}개)
          </AlertTitle>
          {alerts.today.slice(0, 3).map((todo) => (
            <AlertItem key={todo.id} warning>
              <AlertText>{todo.title}</AlertText>
              <AlertBadge warning>오늘</AlertBadge>
            </AlertItem>
          ))}
        </AlertSection>
      )}

      {alerts.tomorrow.length > 0 && (
        <AlertSection>
          <AlertTitle info>
            📅 내일 마감 ({alerts.tomorrow.length}개)
          </AlertTitle>
          {alerts.tomorrow.slice(0, 3).map((todo) => (
            <AlertItem key={todo.id} info>
              <AlertText>{todo.title}</AlertText>
              <AlertBadge info>내일</AlertBadge>
            </AlertItem>
          ))}
        </AlertSection>
      )}
    </AlertContainer>
  );
};

export const RecentActivityWidget = ({
  recentActivity,
}: {
  recentActivity: Todo[];
}) => {
  return (
    <ActivityContainer>
      <ChartTitle>최근 활동</ChartTitle>
      <ActivityList>
        {recentActivity.map((todo) => (
          <ActivityItem key={todo.id}>
            <ActivityIcon status={todo.status}>
              {todo.status === "완료"
                ? "✅"
                : todo.status === "진행 중"
                ? "🔄"
                : "⭐"}
            </ActivityIcon>
            <ActivityInfo>
              <ActivityTitle>{todo.title}</ActivityTitle>
              <ActivityMeta>
                {todo.due_date && `마감: ${todo.due_date}`}
                {todo.priority && ` • ${todo.priority} 우선순위`}
              </ActivityMeta>
            </ActivityInfo>
          </ActivityItem>
        ))}
      </ActivityList>
    </ActivityContainer>
  );
};

// 월별 통계 차트
export const MonthlyStatsChart = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlyStats()
      .then(setMonthlyData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ChartLoading>월별 통계 로딩 중...</ChartLoading>;

  return (
    <ChartContainer full>
      <ChartTitle>월별 생산성 통계</ChartTitle>
      <MonthlyChart>
        {monthlyData.slice(-6).map((item) => (
          <MonthlyBar key={item.month}>
            <MonthLabel>{item.month}</MonthLabel>
            <BarGroup>
              <MonthlyBarFill
                height={item.completion_rate}
                color="#3b82f6"
                title={`전체 완료율: ${item.completion_rate}%`}
              />
              <MonthlyBarFill
                height={item.high_priority_completion_rate}
                color="#ef4444"
                title={`고우선순위 완료율: ${item.high_priority_completion_rate}%`}
              />
            </BarGroup>
            <MonthlyStatsDiv>
              <MonthlyStatItem>전체: {item.completion_rate}%</MonthlyStatItem>
              <MonthlyStatItem>
                고우선: {item.high_priority_completion_rate}%
              </MonthlyStatItem>
            </MonthlyStatsDiv>
          </MonthlyBar>
        ))}
      </MonthlyChart>
      <Legend>
        <LegendItem>
          <LegendColor color="#3b82f6" />
          전체 완료율
        </LegendItem>
        <LegendItem>
          <LegendColor color="#ef4444" />
          고우선순위 완료율
        </LegendItem>
      </Legend>
    </ChartContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SummarySection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ highlight?: boolean }>`
  background: ${(props) =>
    props.highlight
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "#ffffff"};
  color: ${(props) => (props.highlight ? "#ffffff" : "#111827")};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const Count = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Label = styled.div`
  font-size: 1rem;
  opacity: 0.8;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const AlertsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const StatsSection = styled.div`
  margin-bottom: 2rem;
`;

const ChartContainer = styled.div<{ full?: boolean }>`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  ${(props) => props.full && "grid-column: 1 / -1;"}
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #111827;
`;

const TrendChart = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 200px;
  gap: 0.5rem;
`;

const TrendBar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
`;

const BarFill = styled.div<{ height: number }>`
  width: 100%;
  height: ${(props) => Math.max(props.height * 1.5, 10)}px;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 4px 4px 0 0;
  margin-bottom: 0.5rem;
`;

const BarLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const DateLabel = styled.div`
  font-size: 0.7rem;
  color: #6b7280;
`;

const PriorityChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PriorityItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  align-items: center;
  gap: 1rem;
`;

const PriorityInfo = styled.div``;

const PriorityName = styled.div<{ color: string }>`
  font-weight: 600;
  color: ${(props) => props.color};
  margin-bottom: 0.25rem;
`;

const PriorityStats = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ProgressBarContainer = styled.div`
  background: #f3f4f6;
  border-radius: 9999px;
  height: 8px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ width: number; color: string }>`
  width: ${(props) => props.width}%;
  height: 100%;
  background: ${(props) => props.color};
  transition: width 0.3s ease;
`;

const PercentageText = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  min-width: 3rem;
  text-align: right;
`;

const AlertContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const AlertSection = styled.div`
  margin-bottom: 1.5rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const AlertTitle = styled.h4<{
  danger?: boolean;
  warning?: boolean;
  info?: boolean;
}>`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${(props) =>
    props.danger
      ? "#dc2626"
      : props.warning
      ? "#d97706"
      : props.info
      ? "#2563eb"
      : "#111827"};
`;

const AlertItem = styled.div<{
  danger?: boolean;
  warning?: boolean;
  info?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: ${(props) =>
    props.danger
      ? "#fef2f2"
      : props.warning
      ? "#fffbeb"
      : props.info
      ? "#eff6ff"
      : "#f9fafb"};
  border-left: 4px solid
    ${(props) =>
      props.danger
        ? "#dc2626"
        : props.warning
        ? "#d97706"
        : props.info
        ? "#2563eb"
        : "#6b7280"};
`;

const AlertText = styled.span`
  font-size: 0.875rem;
  color: #374151;
  flex: 1;
`;

const AlertBadge = styled.span<{
  danger?: boolean;
  warning?: boolean;
  info?: boolean;
}>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) =>
    props.danger
      ? "#dc2626"
      : props.warning
      ? "#d97706"
      : props.info
      ? "#2563eb"
      : "#6b7280"};
  color: white;
`;

const ActivityContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActivityIcon = styled.div<{ status: string }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  background: ${(props) =>
    props.status === "완료"
      ? "#dcfce7"
      : props.status === "진행 중"
      ? "#fef3c7"
      : "#f3f4f6"};
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const ActivityMeta = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const MonthlyChart = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 250px;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MonthlyBar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
`;

const MonthLabel = styled.div`
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const BarGroup = styled.div`
  display: flex;
  gap: 2px;
  width: 100%;
  justify-content: center;
  align-items: end;
  margin-bottom: 0.5rem;
`;

const MonthlyBarFill = styled.div<{ height: number; color: string }>`
  width: 1rem;
  height: ${(props) => Math.max(props.height * 1.8, 10)}px;
  background: ${(props) => props.color};
  border-radius: 2px;
`;

const MonthlyStatsDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const MonthlyStatItem = styled.div`
  font-size: 0.7rem;
  color: #6b7280;
  text-align: center;
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 1rem;
  height: 1rem;
  background: ${(props) => props.color};
  border-radius: 2px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #6b7280;
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #dc2626;
`;

const ChartLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  color: #6b7280;
  font-size: 0.875rem;
`;
