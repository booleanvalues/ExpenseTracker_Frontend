import React, { useState, useMemo } from 'react';
import {
  Search,
  DollarSign,
  Coffee,
  Home,
  Zap,
  Tv,
  Car,
  ShoppingBag,
  HeartPulse,
  Gift,
  HelpCircle,
  TrendingUp,
  Briefcase,
  TrendingDown,
  Edit2,
  Trash2,
} from 'lucide-react';

// Map categories to beautiful icons
const getCategoryIcon = (category) => {
  const cat = category.toLowerCase();
  switch (cat) {
    case 'salary':
      return <TrendingUp className="amount-income" size={18} />;
    case 'freelance':
      return <Briefcase style={{ color: '#60a5fa' }} size={18} />;
    case 'investments':
      return <DollarSign style={{ color: '#34d399' }} size={18} />;
    case 'food':
      return <Coffee style={{ color: '#fb923c' }} size={18} />;
    case 'rent':
      return <Home style={{ color: '#f87171' }} size={18} />;
    case 'utilities':
      return <Zap style={{ color: '#facc15' }} size={18} />;
    case 'entertainment':
      return <Tv style={{ color: '#c084fc' }} size={18} />;
    case 'transport':
      return <Car style={{ color: '#2dd4bf' }} size={18} />;
    case 'shopping':
      return <ShoppingBag style={{ color: '#f472b6' }} size={18} />;
    case 'medical':
      return <HeartPulse style={{ color: '#f87171' }} size={18} />;
    case 'gifts':
      return <Gift style={{ color: '#a78bfa' }} size={18} />;
    default:
      return <HelpCircle style={{ color: '#9ca3af' }} size={18} />;
  }
};

const ExpenseList = ({ transactions = [], onDeleteTransaction, onSetEditing }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Gather unique categories present in transactions for the filter dropdown
  const uniqueCategories = useMemo(() => {
    const categories = transactions.map((t) => t.category);
    return ['all', ...new Set(categories)];
  }, [transactions]);

  // Apply search and filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === 'all' ? true : t.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' ? true : t.category === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchTerm, typeFilter, categoryFilter]);

  // Format date nicely
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="glass-card">
      <h3 className="section-title">History Logs</h3>

      {/* Filter and Search Controls */}
      <div className="filter-bar">
        <div className="input-wrapper" style={{ flex: 2, minWidth: '220px' }}>
          <Search className="input-icon" size={18} />
          <input
            type="text"
            className="form-input filter-input"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-select filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Incomes</option>
          <option value="expense">Expenses</option>
        </select>

        <select
          className="form-select filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {uniqueCategories.filter((c) => c !== 'all').map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Transaction List Items */}
      <div className="transaction-list-container">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <HelpCircle className="empty-state-icon" size={40} />
            <p>No transaction logs matched your query.</p>
          </div>
        ) : (
          filteredTransactions.map((t) => (
            <div key={t._id} className="transaction-item">
              <div className="transaction-info">
                <div
                  className="category-icon"
                  style={{
                    backgroundColor: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${t.type === 'income' ? 'var(--income-border)' : 'var(--expense-border)'}`,
                  }}
                >
                  {getCategoryIcon(t.category)}
                </div>
                <div className="item-meta">
                  <span className="item-title">{t.text}</span>
                  <div className="item-details">
                    <span className="item-category-tag">{t.category}</span>
                    <span>•</span>
                    <span>{formatDate(t.date)}</span>
                    {t.description && (
                      <>
                        <span>•</span>
                        <span style={{ fontStyle: 'italic' }}>{t.description}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`transaction-amount ${
                  t.type === 'income' ? 'amount-income' : 'amount-expense'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}₹{Math.abs(t.amount).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>

              <div className="transaction-actions">
                <button
                  onClick={() => onSetEditing(t)}
                  className="btn btn-secondary btn-icon"
                  title="Edit"
                  aria-label="Edit transaction"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDeleteTransaction(t._id)}
                  className="btn btn-danger btn-icon"
                  title="Delete"
                  aria-label="Delete transaction"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
