import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#06b6d4', '#6b7280'];

const Charts = ({ transactions = [] }) => {
  // 1. Process data for Income vs Expense Daily Timeline
  const dailyData = useMemo(() => {
    const map = {};
    // Sort transactions chronologically for chronological chart timeline
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Group last 7 unique days of active transactions
    sorted.forEach((t) => {
      const dateLabel = new Date(t.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
      if (!map[dateLabel]) {
        map[dateLabel] = { date: dateLabel, Income: 0, Expenses: 0 };
      }
      if (t.type === 'income') {
        map[dateLabel].Income += Number(t.amount);
      } else {
        map[dateLabel].Expenses += Number(t.amount);
      }
    });

    return Object.values(map).slice(-7); // Keep the last 7 active transaction days
  }, [transactions]);

  // 2. Process data for Expenses by Category (Donut chart)
  const categoryData = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const cat = t.category || 'Other';
        map[cat] = (map[cat] || 0) + Number(t.amount);
      });

    return Object.keys(map).map((key) => ({
      name: key,
      value: Number(map[key].toFixed(2)),
    }));
  }, [transactions]);

  // Formatter for Tooltip values
  const formatTooltip = (value) => [`₹${Number(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`];

  return (
    <div className="charts-grid">
      <div className="glass-card chart-card">
        <h3 className="section-title">Income vs Expenses (Timeline)</h3>
        {dailyData.length === 0 ? (
          <div className="empty-state">No transaction logs available for timeline.</div>
        ) : (
          <div className="chart-container-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={formatTooltip}
                  contentStyle={{
                    backgroundColor: 'rgba(9, 13, 22, 0.95)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Income" fill="var(--income)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="var(--expense)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="glass-card chart-card">
        <h3 className="section-title">Expenses by Category</h3>
        {categoryData.length === 0 ? (
          <div className="empty-state">No expense records found.</div>
        ) : (
          <div className="chart-container-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={formatTooltip}
                  contentStyle={{
                    backgroundColor: 'rgba(9, 13, 22, 0.95)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: '10px', maxHeight: '50px', overflowY: 'auto' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;
