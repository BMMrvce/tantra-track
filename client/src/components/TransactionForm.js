import React, { useState } from 'react';

function TransactionForm({ categories, onAddTransaction }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const currentCategories = formData.type === 'income' ? incomeCategories : expenseCategories;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === 'type' && { category: '' })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || formData.amount <= 0) {
      alert('Please fill all required fields with valid values');
      return;
    }

    onAddTransaction({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset form
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="card">
      <h1 className="page-title">Add New Transaction</h1>
      <p className="page-subtitle">Capture income and expenses with precise tagging for better insights.</p>

      {showSuccess && (
        <div className="notice-success">
          ✅ Transaction added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          {/* Type Selection */}
          <div className="form-group">
            <label htmlFor="type">Transaction Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="expense">💸 Expense</option>
              <option value="income">💰 Income</option>
            </select>
          </div>

          {/* Category Selection */}
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {currentCategories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-2">
          {/* Amount */}
          <div className="form-group">
            <label htmlFor="amount">Amount (₹) *</label>
            <input
              id="amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add any notes about this transaction..."
            rows="3"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary btn-block">
          ➕ Add Transaction
        </button>
      </form>

      {/* Form Tips */}
      <div className="transaction-tip-box">
        <h3 className="transaction-tip-title">💡 Tips:</h3>
        <ul className="transaction-tip-list">
          <li>Set the correct type (Income or Expense)</li>
          <li>Choose a category that best matches your transaction</li>
          <li>Include a description for better tracking</li>
          <li>Make sure the amount is positive</li>
        </ul>
      </div>
    </div>
  );
}

export default TransactionForm;
