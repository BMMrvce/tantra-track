import React, { useMemo, useState } from 'react';

function Dashboard({ transactions, loading }) {
  const [typeFilter, setTypeFilter] = useState('all');
  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (typeFilter === 'all') {
      return transactions;
    }
    return transactions.filter((transaction) => transaction.type === typeFilter);
  }, [transactions, typeFilter]);

  const recentTransactions = filteredTransactions.slice(0, 10);

  return (
    <div className="dashboard">
      <div className="card dashboard-hero">
        <h1 className="page-title">Command Center</h1>
        <p className="page-subtitle">Track your money movement in one focused, real-time dashboard.</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card income">
          <div className="stat-label">💰 Total Income</div>
          <div className="stat-value income">₹ {stats.income.toFixed(2)}</div>
        </div>
        
        <div className="stat-card expense">
          <div className="stat-label">💸 Total Expenses</div>
          <div className="stat-value expense">₹ {stats.expenses.toFixed(2)}</div>
        </div>
        
        <div className={`stat-card ${stats.balance >= 0 ? 'balance' : 'expense'}`}>
          <div className="stat-label">📊 Net Balance</div>
          <div className={`stat-value ${stats.balance >= 0 ? 'income' : 'expense'}`}>
            ₹ {stats.balance.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2 className="card-title">Recent Transactions</h2>
        <div className="command-filter-row">
          <button
            className={`command-filter-btn ${typeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTypeFilter('all')}
            type="button"
          >
            All
          </button>
          <button
            className={`command-filter-btn ${typeFilter === 'income' ? 'active' : ''}`}
            onClick={() => setTypeFilter('income')}
            type="button"
          >
            Income
          </button>
          <button
            className={`command-filter-btn ${typeFilter === 'expense' ? 'active' : ''}`}
            onClick={() => setTypeFilter('expense')}
            type="button"
          >
            Expense
          </button>
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : recentTransactions.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map(txn => (
                  <tr key={txn.id}>
                    <td>{new Date(txn.date).toLocaleDateString('en-IN')}</td>
                    <td>{txn.category}</td>
                    <td>{txn.description || '—'}</td>
                    <td>
                      <span className={`badge ${txn.type}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className={txn.type === 'income' ? 'text-success' : 'text-danger'}>
                      {txn.type === 'income' ? '+' : '-'} ₹ {txn.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
              <div className="empty-state-text">No matching transactions</div>
              <p>Try switching filters or add a new transaction.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
