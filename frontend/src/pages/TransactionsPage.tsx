import React, { useState, useEffect, useCallback } from 'react';
// Corrected Wails bindings path
import { GetTransactions } from '../wailsAdapter';
import { models } from '../../wailsjs/go/models';

import AddTransactionForm from '../components/AddTransactionForm';

// Assuming models.Transaction, models.Account, models.Category are available from Wails
type Transaction = models.Transaction;
// We might need Account and Category types if we want to display their names instead of IDs directly
// For now, the transaction list will show IDs, but a better UI would fetch and map names.

const TransactionsPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState<boolean>(true); // Show form by default

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await GetTransactions(); // This fetches all transactions
            setTransactions(result || []);
        } catch (err: any) {
            console.error("Error fetching transactions:", err);
            setError(err.message || 'Failed to fetch transactions');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleTransactionAdded = () => {
        fetchTransactions(); // Refresh the list
        // setShowAddForm(false); // Optionally hide form, or keep it open
    };

    const formatDate = (dateString: string | Date): string => {
        // Wails might return date as a string (e.g. RFC3339) or it might be a Date object
        // if models.Transaction.Date is time.Time. For safety, handle both.
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return date.toLocaleDateString(); // Simple local date format
    };


    return (
        <div className="page-container">
            <h2>Transactions</h2>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setShowAddForm(!showAddForm)} style={{ marginRight: '10px' }}>
                    {showAddForm ? 'Hide Form' : 'Add New Transaction'}
                </button>
                <button onClick={fetchTransactions} disabled={isLoading}>
                    {isLoading ? 'Refreshing...' : 'Refresh List'}
                </button>
            </div>

            {showAddForm && <AddTransactionForm onTransactionAdded={handleTransactionAdded} />}

            {isLoading && <p>Loading transactions...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {!isLoading && !error && transactions.length === 0 && (
                <p>No transactions found. Click "Add New Transaction" to get started.</p>
            )}

            {!isLoading && !error && transactions.length > 0 && (
                <table className="transactions-table"> {/* Distinct class */}
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Account ID</th> {/* TODO: Show Account Name */}
                            <th>Category ID</th>{/* TODO: Show Category Name */}
                            <th>Status</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>{transaction.id}</td>
                                <td>{formatDate(transaction.date)}</td>
                                <td>{transaction.description}</td>
                                <td>{transaction.type}</td>
                                <td style={{ color: transaction.amount < 0 ? 'red' : 'green' }}>
                                    {transaction.amount.toFixed(2)}
                                </td>
                                <td>{transaction.accountId}</td>
                                <td>{transaction.categoryId}</td>
                                <td>{transaction.status}</td>
                                <td>{transaction.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TransactionsPage; 