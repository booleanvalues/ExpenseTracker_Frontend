import React, { useState, useEffect } from 'react';
import { PlusCircle, Save } from 'lucide-react';

const INCOME_CATEGORIES = ['Salary', 'Investments', 'Freelance', 'Gifts', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Transport', 'Shopping', 'Medical', 'Other'];

const ExpenseForm = ({ onAddTransaction, editingTransaction, onUpdateTransaction, clearEditing }) => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  // Populate form if in edit mode
  useEffect(() => {
    if (editingTransaction) {
      setText(editingTransaction.text || '');
      setAmount(Math.abs(editingTransaction.amount) || '');
      setType(editingTransaction.type || 'expense');
      setCategory(editingTransaction.category || '');
      setDate(editingTransaction.date ? editingTransaction.date.substring(0, 10) : '');
      setDescription(editingTransaction.description || '');
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  // Set default category when type changes
  useEffect(() => {
    const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [type]);

  const resetForm = () => {
    setText('');
    setAmount('');
    setType('expense');
    setCategory(EXPENSE_CATEGORIES[0]);
    setDate(new Date().toISOString().substring(0, 10));
    setDescription('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim() || !amount || !category) {
      alert('Please fill out all required fields');
      return;
    }

    const transactionData = {
      text,
      amount: Math.abs(Number(amount)),
      type,
      category,
      date: date ? new Date(date) : new Date(),
      description,
    };

    if (editingTransaction) {
      onUpdateTransaction(editingTransaction._id, transactionData);
    } else {
      onAddTransaction(transactionData);
      resetForm();
    }
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="glass-card form-card">
      <h3 className="section-title">
        {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="type">Transaction Type</label>
          <div className="form-row">
            <button
              type="button"
              className={`btn ${type === 'expense' ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => setType('expense')}
              style={{ width: '100%' }}
            >
              Expense
            </button>
            <button
              type="button"
              className={`btn ${type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setType('income')}
              style={{ width: '100%', background: type === 'income' ? 'var(--income)' : '', boxShadow: type === 'income' ? '0 4px 15px var(--income-glow)' : '' }}
            >
              Income
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="text">Title</label>
          <input
            type="text"
            id="text"
            className="form-input"
            style={{ paddingLeft: '16px' }}
            placeholder="e.g. Grocery Shopping"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              min="0.01"
              step="0.01"
              className="form-input"
              style={{ paddingLeft: '16px' }}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category">Category</label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            className="form-input"
            style={{ paddingLeft: '16px' }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Notes (Optional)</label>
          <input
            type="text"
            id="description"
            className="form-input"
            style={{ paddingLeft: '16px' }}
            placeholder="Add brief details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-row" style={{ marginTop: '24px' }}>
          {editingTransaction && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearEditing}
              style={{ width: '100%' }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', gridColumn: editingTransaction ? 'span 1' : 'span 2' }}
          >
            {editingTransaction ? (
              <>
                <Save size={18} /> Update
              </>
            ) : (
              <>
                <PlusCircle size={18} /> Add Record
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
