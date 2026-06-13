import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../api/transactionApi';
import Navbar from '../components/Navbar';
import SummaryCard from '../components/SummaryCard';
import Charts from '../components/Charts';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { token, user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Load user transactions
  const loadTransactions = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransactions(token);
      setTransactions(data);
    } catch (err) {
      setError(err.message || 'Failed to load transaction data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Add a new transaction record
  const handleAddTransaction = async (transactionData) => {
    try {
      const newRecord = await createTransaction(transactionData, token);
      // Append to the list (since database sorts desc, prepend or reload)
      setTransactions((prev) => [newRecord, ...prev]);
    } catch (err) {
      alert(err.message || 'Could not add transaction');
    }
  };

  // Update transaction record
  const handleUpdateTransaction = async (id, transactionData) => {
    try {
      const updated = await updateTransaction(id, transactionData, token);
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? updated : t))
      );
      setEditingTransaction(null);
    } catch (err) {
      alert(err.message || 'Could not update transaction');
    }
  };

  // Delete transaction record
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteTransaction(id, token);
        setTransactions((prev) => prev.filter((t) => t._id !== id));
        if (editingTransaction && editingTransaction._id === id) {
          setEditingTransaction(null);
        }
      } catch (err) {
        alert(err.message || 'Could not delete transaction');
      }
    }
  };

  const handleSetEditing = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleClearEditing = () => {
    setEditingTransaction(null);
  };

  return (
    <>
      <Navbar />
      <main className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Welcome back, {user?.name || 'User'}!</h1>
          <p className="dashboard-subtitle">Monitor and review your personal finances seamlessly</p>
        </header>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="empty-state" style={{ padding: '80px 0' }}>
            <div className="user-avatar" style={{ width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }}></div>
            <p>Gathering your transaction records...</p>
          </div>
        ) : (
          <>
            {/* Summary cards with calculated figures */}
            <SummaryCard transactions={transactions} />

            {/* Recharts Analytics panels */}
            <Charts transactions={transactions} />

            {/* Grid for Form input and List history */}
            <div className="main-grid">
              <ExpenseList
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
                onSetEditing={handleSetEditing}
              />
              <ExpenseForm
                onAddTransaction={handleAddTransaction}
                editingTransaction={editingTransaction}
                onUpdateTransaction={handleUpdateTransaction}
                clearEditing={handleClearEditing}
              />
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Dashboard;
