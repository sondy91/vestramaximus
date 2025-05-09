import React, { useState, useEffect, useCallback } from 'react';
// Corrected Wails bindings path
import { GetAccounts } from '../../wailsjs/go/main/App';
import { models } from '../../wailsjs/go/models'; // Import the Go models

// Import the form component
import AddAccountForm from '../components/AddAccountForm'; // Path from src/pages/

// Define the Account type for the frontend, matching models.Account
// Wails v2.beta.43+ should generate TS types for your Go structs if they are used as parameters or return types
// in bound methods. If `models.Account` is available, we can use it directly.
// If not, define it manually:
// interface Account {
//     id: number; // Go int64 maps to number in JS/TS
//     name: string;
//     type: string;
//     initialBalance: number;
//     currentBalance: number;
// }
// For this example, we'll assume models.Account is correctly generated and imported.
type Account = models.Account;

const AccountsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState<boolean>(false); // State to toggle form visibility

    // Wrapped fetchAccounts in useCallback to prevent re-creation on every render
    // unless its dependencies change (none in this case, but good practice).
    const fetchAccounts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await GetAccounts();
            // Wails often returns 'null' for empty slices from Go, rather than an empty array.
            setAccounts(result || []);
        } catch (err: any) {
            console.error("Error fetching accounts:", err);
            setError(err.message || 'Failed to fetch accounts');
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array: function is created once

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]); // fetchAccounts is now a stable dependency

    const handleAccountAdded = () => {
        fetchAccounts(); // Refresh the list
        setShowAddForm(false); // Optionally hide form after adding
    };

    return (
        <div className="page-container">
            <h2>Accounts Management</h2>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setShowAddForm(!showAddForm)} style={{marginRight: '10px'}}>
                    {showAddForm ? 'Cancel' : 'Add New Account'}
                </button>
                <button onClick={fetchAccounts} disabled={isLoading}>
                    {isLoading ? 'Refreshing...' : 'Refresh List'}
                </button>
            </div>

            {showAddForm && <AddAccountForm onAccountAdded={handleAccountAdded} />}

            {isLoading && <p>Loading accounts...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {!isLoading && !error && accounts.length === 0 && !showAddForm && (
                <p>No accounts found. Click "Add New Account" to get started.</p>
            )}

            {!isLoading && !error && accounts.length > 0 && (
                <table className="accounts-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Initial Balance</th>
                            <th>Current Balance</th>
                            {/* Add Actions column later (Edit/Delete) */}
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => (
                            <tr key={account.id}>
                                <td>{account.id}</td>
                                <td>{account.name}</td>
                                <td>{account.type}</td>
                                <td>{account.initialBalance.toFixed(2)}</td>
                                <td>{account.currentBalance.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AccountsPage; 