import React, { useState, useEffect } from 'react';
// Corrected Wails bindings path
import { AddTransaction, GetAccounts, GetCategories } from '../../wailsjs/go/main/App';
import { models } from '../../wailsjs/go/models';

type Account = models.Account;
type Category = models.Category;
type Transaction = models.Transaction;

interface AddTransactionFormProps {
    onTransactionAdded: () => void;
}

interface TransactionFormData {
    dateString: string; // Store date as string from input
    amount: string;
    type: 'Income' | 'Expense';
    description: string;
    categoryID: string; // Store as string
    accountID: string;  // Store as string
    notes: string;
    status: 'Cleared' | 'Pending';
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onTransactionAdded }) => {
    const [formData, setFormData] = useState<TransactionFormData>({
        dateString: new Date().toISOString().split('T')[0], // Default to today YYYY-MM-DD
        amount: '0.00',
        type: 'Expense',
        description: '',
        categoryID: '',
        accountID: '',
        notes: '',
        status: 'Cleared',
    });

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch accounts and categories for dropdowns
    useEffect(() => {
        const fetchDataForDropdowns = async () => {
            try {
                const accs = await GetAccounts();
                setAccounts(accs || []);
                if (accs && accs.length > 0 && !formData.accountID) {
                    setFormData(prev => ({ ...prev, accountID: accs[0].id.toString() }));
                }

                const cats = await GetCategories();
                setCategories(cats || []);
            } catch (err) {
                console.error("Error fetching data for transaction form:", err);
                setError("Could not load accounts/categories for the form.");
            }
        };
        fetchDataForDropdowns();
    }, []); // formData.accountID removed from deps to avoid loop if default is set

    // Filter categories based on selected transaction type
    useEffect(() => {
        const currentTypeCategories = categories.filter(cat => cat.type === formData.type);
        setFilteredCategories(currentTypeCategories);
        // If current categoryID is not in the filtered list, reset it
        if (formData.categoryID && !currentTypeCategories.find(cat => cat.id.toString() === formData.categoryID)) {
            setFormData(prev => ({ ...prev, categoryID: currentTypeCategories.length > 0 ? currentTypeCategories[0].id.toString() : "" }));
        } else if (!formData.categoryID && currentTypeCategories.length > 0){
             setFormData(prev => ({ ...prev, categoryID: currentTypeCategories[0].id.toString() }));
        }
    }, [formData.type, categories, formData.categoryID]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

        if (!formData.accountID) {
            setError('Please select an account.');
            setIsSubmitting(false);
            return;
        }
        if (!formData.categoryID) {
            setError('Please select a category.');
            setIsSubmitting(false);
            return;
        }

        let transactionAmount = parseFloat(formData.amount);
        if (isNaN(transactionAmount)) {
            setError('Amount must be a valid number.');
            setIsSubmitting(false);
            return;
        }
        if (transactionAmount === 0) {
            setError('Amount cannot be zero.');
            setIsSubmitting(false);
            return;
        }

        // Ensure amount has correct sign based on type
        if (formData.type === 'Expense' && transactionAmount > 0) {
            transactionAmount = -transactionAmount;
        } else if (formData.type === 'Income' && transactionAmount < 0) {
            transactionAmount = Math.abs(transactionAmount);
        }


        try {
            // Go backend AddTransaction expects: dateString, amount, transactionType, description, categoryID, accountID, notes, status
            await AddTransaction(
                formData.dateString, // Send as YYYY-MM-DD string or full ISO
                transactionAmount,
                formData.type,
                formData.description,
                parseInt(formData.categoryID, 10),
                parseInt(formData.accountID, 10),
                formData.notes,
                formData.status
            );

            setSuccessMessage(`Transaction added successfully!`);
            setFormData({ // Reset form
                dateString: new Date().toISOString().split('T')[0],
                amount: '0.00',
                type: 'Expense',
                description: '',
                categoryID: filteredCategories.length > 0 ? filteredCategories[0].id.toString() : "",
                accountID: accounts.length > 0 ? accounts[0].id.toString() : "",
                notes: '',
                status: 'Cleared',
            });
            onTransactionAdded(); // Trigger callback
        } catch (err: any) {
            console.error("Error adding transaction:", err);
            setError(err.message || 'Failed to add transaction.');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-transaction-form"> {/* Distinct class */}
            <h3>Add New Transaction</h3>
            {error && <p className="form-error">Error: {error}</p>}
            {successMessage && <p className="form-success">{successMessage}</p>}

            <div className="form-group">
                <label htmlFor="dateString">Date:</label>
                <input type="date" id="dateString" name="dateString" value={formData.dateString} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
                <label htmlFor="type">Type:</label>
                <select id="type" name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="amount">Amount:</label>
                <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleInputChange} step="0.01" required />
                <small style={{marginLeft: '10px'}}>
                    {formData.type === 'Expense' ? '(Enter as positive, will be stored as negative)' : '(Enter as positive)'}
                </small>
            </div>


            <div className="form-group">
                <label htmlFor="description">Description:</label>
                <input type="text" id="description" name="description" value={formData.description} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
                <label htmlFor="accountID">Account:</label>
                <select id="accountID" name="accountID" value={formData.accountID} onChange={handleInputChange} required>
                    <option value="">-- Select Account --</option>
                    {accounts.map(acc => (
                        <option key={acc.id} value={acc.id.toString()}>{acc.name} (Balance: {acc.currentBalance.toFixed(2)})</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="categoryID">Category:</label>
                <select id="categoryID" name="categoryID" value={formData.categoryID} onChange={handleInputChange} required disabled={filteredCategories.length === 0}>
                    <option value="">-- Select Category --</option>
                    {filteredCategories.map(cat => (
                        <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                    ))}
                </select>
                {categories.length > 0 && filteredCategories.length === 0 && formData.type && (
                     <small style={{color: 'orange', marginLeft: '5px'}}>No {formData.type.toLowerCase()} categories available. Please add one first.</small>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="notes">Notes (Optional):</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={3}></textarea>
            </div>

            <div className="form-group">
                <label htmlFor="status">Status:</label>
                <select id="status" name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="Cleared">Cleared</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>

            <button type="submit" disabled={isSubmitting || (categories.length > 0 && filteredCategories.length === 0)}>
                {isSubmitting ? 'Adding...' : 'Add Transaction'}
            </button>
        </form>
    );
};

export default AddTransactionForm; 