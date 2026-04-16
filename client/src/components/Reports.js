import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';

function Reports({ transactions, categories }) {
  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeSliceIndex, setActiveSliceIndex] = useState(0);

  const currentYear = new Date().getFullYear();

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#c084fc', '#06b6d4', '#ec4899', '#14b8a6'];

  // Filter transactions based on report type
  const filteredTransactions = useMemo(() => {
    if (reportType === 'monthly') {
      return transactions.filter(t => {
        const txnDate = new Date(t.date);
        return txnDate.getMonth() + 1 === parseInt(selectedMonth) && 
               txnDate.getFullYear() === parseInt(selectedYear);
      });
    } else if (reportType === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      return transactions.filter(t => t.date === today);
    } else {
      // Weekly
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return transactions.filter(t => {
        const txnDate = new Date(t.date);
        return txnDate >= startOfWeek;
      });
    }
  }, [transactions, reportType, selectedMonth, selectedYear]);

  // Calculate report statistics
  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const byCategory = {};
    filteredTransactions.forEach(t => {
      if (!byCategory[t.category]) {
        byCategory[t.category] = { count: 0, income: 0, expense: 0 };
      }
      byCategory[t.category].count += 1;
      if (t.type === 'income') byCategory[t.category].income += t.amount;
      else byCategory[t.category].expense += t.amount;
    });

    const categoryChartData = Object.entries(byCategory).map(([name, data]) => ({
      name,
      income: data.income,
      expense: data.expense,
      total: data.income + data.expense
    }));

    const pieData = [
      { name: 'Income', value: income },
      { name: 'Expense', value: expenses }
    ];

    return {
      income,
      expenses,
      balance: income - expenses,
      count: filteredTransactions.length,
      byCategory,
      categoryChartData,
      pieData
    };
  }, [filteredTransactions]);

  const trendData = useMemo(() => {
    const trendMap = {};

    filteredTransactions.forEach((transaction) => {
      if (!trendMap[transaction.date]) {
        trendMap[transaction.date] = { date: transaction.date, income: 0, expense: 0, net: 0 };
      }

      if (transaction.type === 'income') {
        trendMap[transaction.date].income += transaction.amount;
      } else {
        trendMap[transaction.date].expense += transaction.amount;
      }

      trendMap[transaction.date].net = trendMap[transaction.date].income - trendMap[transaction.date].expense;
    });

    return Object.values(trendMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => ({
        ...item,
        label: new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
      }));
  }, [filteredTransactions]);

  return (
    <div className="dashboard">
      <div className="card dashboard-hero">
        <h1 className="page-title">Analytics Studio</h1>
        <p className="page-subtitle">Explore patterns with a live financial timeline, allocation mix, and category battle chart.</p>
      </div>

      {/* Report Type Selection */}
      <div className="card">
        <div className="report-controls">
          {['daily', 'weekly', 'monthly'].map(type => (
            <button
              key={type}
              className={`report-toggle-btn ${reportType === type ? 'active' : ''}`}
              onClick={() => setReportType(type)}
            >
              {type === 'daily' && '📅 Daily'}
              {type === 'weekly' && '📆 Weekly'}
              {type === 'monthly' && '📊 Monthly'}
            </button>
          ))}
        </div>

        {/* Month/Year Selection for Monthly Report */}
        {reportType === 'monthly' && (
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="month">Month</label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>
                    {new Date(2000, m - 1).toLocaleDateString('en-IN', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="year">Year</label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {Array.from({ length: 5 }, (_, i) => currentYear - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card income">
          <div className="stat-label">💰 Income</div>
          <div className="stat-value income">₹ {stats.income.toFixed(2)}</div>
        </div>
        
        <div className="stat-card expense">
          <div className="stat-label">💸 Expenses</div>
          <div className="stat-value expense">₹ {stats.expenses.toFixed(2)}</div>
        </div>
        
        <div className={`stat-card ${stats.balance >= 0 ? 'balance' : 'expense'}`}>
          <div className="stat-label">📊 Balance</div>
          <div className={`stat-value ${stats.balance >= 0 ? 'income' : 'expense'}`}>
            ₹ {stats.balance.toFixed(2)}
          </div>
        </div>

        <div className="stat-card income">
          <div className="stat-label">🔢 Transactions</div>
          <div className="stat-value">{stats.count}</div>
        </div>
      </div>

      {/* Charts */}
      {stats.categoryChartData.length > 0 && (
        <>
          <div className="chart-grid">
            {/* Category Bar Chart */}
            <div className="chart-container">
              <h2 className="card-title">Income vs Expenses by Category</h2>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={stats.categoryChartData}>
                  <defs>
                    <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.95} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fb7185" stopOpacity={0.95} />
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0.65} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis dataKey="name" tick={{ fill: '#dbeafe', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#dbeafe', fontSize: 12 }} />
                  <Tooltip formatter={(value) => `₹ ${Number(value).toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="income" fill="url(#incomeBar)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expense" fill="url(#expenseBar)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Allocation Pie Chart */}
            {stats.pieData.some(d => d.value > 0) && (
              <div className="chart-container">
                <h2 className="card-title">Income vs Expenses Ratio</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={stats.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
                      dataKey="value"
                      activeIndex={activeSliceIndex}
                      onMouseEnter={(_, index) => setActiveSliceIndex(index)}
                    >
                      {stats.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹ ${Number(value).toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Trend Charts */}
          {trendData.length > 0 && (
            <div className="chart-grid">
              <div className="chart-container">
                <h2 className="card-title">Net Movement Timeline</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="netArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.08} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis dataKey="label" tick={{ fill: '#dbeafe', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#dbeafe', fontSize: 12 }} />
                    <Tooltip formatter={(value) => `₹ ${Number(value).toFixed(2)}`} />
                    <Area type="monotone" dataKey="net" stroke="#38bdf8" fillOpacity={1} fill="url(#netArea)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h2 className="card-title">Income & Expense Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis dataKey="label" tick={{ fill: '#dbeafe', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#dbeafe', fontSize: 12 }} />
                    <Tooltip formatter={(value) => `₹ ${Number(value).toFixed(2)}`} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2.8} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="expense" stroke="#fb7185" strokeWidth={2.8} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}

      {/* Category Summary Table */}
      <div className="card">
        <h2 className="card-title">Category Breakdown</h2>
        {Object.keys(stats.byCategory).length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Count</th>
                  <th>Income</th>
                  <th>Expense</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.byCategory).map(([category, data]) => (
                  <tr key={category}>
                    <td><strong>{category}</strong></td>
                    <td>{data.count}</td>
                    <td className="text-success">
                      {data.income > 0 ? `₹ ${data.income.toFixed(2)}` : '—'}
                    </td>
                    <td className="text-danger">
                      {data.expense > 0 ? `₹ ${data.expense.toFixed(2)}` : '—'}
                    </td>
                    <td className={data.income >= data.expense ? 'text-success' : 'text-danger'}>
                      ₹ {(data.income - data.expense).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">No transactions found for this period</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
