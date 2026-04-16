import React, { useMemo, useState } from 'react';

function Dashboard({ transactions, categories, loading, onDeleteTransaction, onEditTransaction }) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editForm, setEditForm] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: ''
  });
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

  const incomeCategories = categories.filter((category) => category.type === 'income');
  const expenseCategories = categories.filter((category) => category.type === 'expense');
  const currentEditCategories = editForm.type === 'income' ? incomeCategories : expenseCategories;

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setEditForm({
      type: transaction.type,
      category: transaction.category,
      amount: String(transaction.amount),
      description: transaction.description || '',
      date: transaction.date
    });
  };

  const closeEditModal = () => {
    setEditingTransaction(null);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === 'type' && { category: '' })
    }));
  };

  const submitEdit = (event) => {
    event.preventDefault();
    if (!editingTransaction) {
      return;
    }

    onEditTransaction(editingTransaction.id, {
      ...editForm,
      amount: parseFloat(editForm.amount)
    });
    closeEditModal();
  };

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
                  <th>Actions</th>
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
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-secondary btn-compact"
                          onClick={() => openEditModal(txn)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-compact"
                          onClick={() => onDeleteTransaction(txn.id)}
                        >
                          Delete
                        </button>
                      </div>
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

      {editingTransaction && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">Edit Transaction</div>
            <form onSubmit={submitEdit}>
              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="edit-type">Type</label>
                  <select id="edit-type" name="type" value={editForm.type} onChange={handleEditChange}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-category">Category</label>
                  <select
                    id="edit-category"
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Select category</option>
                    {currentEditCategories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="edit-amount">Amount</label>
                  <input
                    id="edit-amount"
                    type="number"
                    name="amount"
                    value={editForm.amount}
                    onChange={handleEditChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-date">Date</label>
                  <input
                    id="edit-date"
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows="3"
                  value={editForm.description}
                  onChange={handleEditChange}
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
