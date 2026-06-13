import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

const SummaryCard = ({ transactions = [] }) => {
  const amounts = transactions.map((transaction) => {
    // Treat expense as subtractive and income as additive for overall balance
    const val = Number(transaction.amount) || 0;
    return transaction.type === 'expense' ? -Math.abs(val) : Math.abs(val);
  });

  const totalBalance = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);

  const totalIncome = transactions
    .filter((item) => item.type === 'income')
    .reduce((acc, item) => acc + Number(item.amount), 0)
    .toFixed(2);

  const totalExpense = transactions
    .filter((item) => item.type === 'expense')
    .reduce((acc, item) => acc + Number(item.amount), 0)
    .toFixed(2);

  // Helper function to format currency
  const formatCurrency = (value) => {
    const numericValue = Number(value);
    const absVal = Math.abs(numericValue).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return numericValue < 0 ? `-₹${absVal}` : `₹${absVal}`;
  };

  return (
    <div className="summary-grid">
      <div className="glass-card summary-card card-balance">
        <div className="summary-content">
          <div>
            <div className="summary-label">Total Balance</div>
            <div className="summary-value">{formatCurrency(totalBalance)}</div>
          </div>
          <div className="summary-icon-wrapper">
            <Wallet size={24} />
          </div>
        </div>
      </div>

      <div className="glass-card summary-card card-income">
        <div className="summary-content">
          <div>
            <div className="summary-label">Total Income</div>
            <div className="summary-value" style={{ color: 'var(--income)' }}>
              +{formatCurrency(totalIncome)}
            </div>
          </div>
          <div className="summary-icon-wrapper">
            <ArrowUpCircle size={24} />
          </div>
        </div>
      </div>

      <div className="glass-card summary-card card-expense">
        <div className="summary-content">
          <div>
            <div className="summary-label">Total Expenses</div>
            <div className="summary-value" style={{ color: 'var(--expense)' }}>
              -{formatCurrency(totalExpense)}
            </div>
          </div>
          <div className="summary-icon-wrapper">
            <ArrowDownCircle size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
