import React, { useState } from 'react';
// Corrected Wails bindings path
import { AddAccount } from '../wailsAdapter';
import { models } from '../../wailsjs/go/models';

// Define props for the form, including a callback for when an account is added
interface AddAccountFormProps {
    onAccountAdded: () => void; // Callback to refresh the accounts list
}

// Define an interface for the form state
interface AccountFormData {
    name: string;
    type: string;
    initialBalance: string; // Store as string to handle input, parse to float on submit
}

const AccountTypes = ["Checking", "Savings", "Credit Card", "Loan", "Cash", "Investment", "Other"];

const AddAccountForm: React.FC<AddAccountFormProps> = ({ onAccountAdded }) => {
    const [formData, setFormData] = useState<AccountFormData>({
        name: '',
        type: AccountTypes[0], // Default to the first account type
        initialBalance: '0.00',
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        const balance = parseFloat(formData.initialBalance);
        if (isNaN(balance)) {
            setError('Initial balance must be a valid number.');
            setIsSubmitting(false);
            return;
        }
        if (!formData.name.trim()) {
            setError('Account name cannot be empty.');
            setIsSubmitting(false);
            return;
        }


        try {
            // Ensure models.Account is the correct type expected by your Go backend
            // The AddAccount Go function expects name, type, and initialBalance.
            const newAccountData = {
                name: formData.name,
                accountType: formData.type, // Ensure field name matches Go function param
                initialBalance: balance,
            };

            // Call the Go function
            // The Wails generated AddAccount function will match the signature of your Go method.
            const createdAccount: models.Account = await AddAccount(
                newAccountData.name,
                newAccountData.accountType,
                newAccountData.initialBalance
            );

            setSuccessMessage(`Account "${createdAccount.name}" added successfully!`);
            setFormData({ name: '', type: AccountTypes[0], initialBalance: '0.00' }); // Reset form
            onAccountAdded(); // Trigger the callback to refresh the parent list
        } catch (err: any) {
            console.error("Error adding account:", err);
            setError(err.message || 'Failed to add account.');
        } finally {
            setIsSubmitting(false);
            // Clear success message after a few seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-account-form">
            <h3>Add New Account</h3>
            {error && <p className="form-error">Error: {error}</p>}
            {successMessage && <p className="form-success">{successMessage}</p>}

            <div className="form-group">
                <label htmlFor="name">Account Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="type">Account Type:</label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                >
                    {AccountTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="initialBalance">Initial Balance:</label>
                <input
                    type="number"
                    id="initialBalance"
                    name="initialBalance"
                    value={formData.initialBalance}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                />
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Account'}
            </button>
        </form>
    );
};

export default AddAccountForm; 