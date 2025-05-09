import React, { useState } from 'react';
import { AddBudgetPeriod } from '../../wailsjs/go/main/App'; // Adjust path as needed
import { models } from '../../wailsjs/go/models'; // Adjust path as needed

interface AddBudgetPeriodFormProps {
  onBudgetPeriodAdded: (newPeriod: models.BudgetPeriod) => void;
}

const AddBudgetPeriodForm: React.FC<AddBudgetPeriodFormProps> = ({ onBudgetPeriodAdded }) => {
  const [name, setName] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(''); // Store as YYYY-MM-DD string for input type="date"
  const [endDate, setEndDate] = useState<string>('');   // Store as YYYY-MM-DD string
  const [status, setStatus] = useState<string>('Open'); // Default status
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!name.trim()) {
      setError('Budget period name cannot be empty.');
      setIsSubmitting(false);
      return;
    }
    if (!startDate) {
      setError('Start date is required.');
      setIsSubmitting(false);
      return;
    }
    if (!endDate) {
      setError('End date is required.');
      setIsSubmitting(false);
      return;
    }
    // Basic date validation (end date after start date)
    if (new Date(endDate) <= new Date(startDate)) {
        setError('End date must be after start date.');
        setIsSubmitting(false);
        return;
    }

    try {
      // Wails expects date strings (e.g., ISO or YYYY-MM-DD). The Go backend will parse them.
      const newPeriod = await AddBudgetPeriod(name, startDate, endDate, status);
      onBudgetPeriodAdded(newPeriod);
      // Reset form
      setName('');
      setStartDate('');
      setEndDate('');
      setStatus('Open');
    } catch (err: any) {
      console.error('Error adding budget period:', err);
      setError(err.message || 'Failed to add budget period');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="bp-name">Name:</label>
        <input
          id="bp-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="bp-start-date">Start Date:</label>
        <input
          id="bp-start-date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="bp-end-date">End Date:</label>
        <input
          id="bp-end-date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="bp-status">Status:</label>
        <select 
          id="bp-status" 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
          <option value="Archived">Archived</option>
        </select>
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Budget Period'}
      </button>
    </form>
  );
};

export default AddBudgetPeriodForm; 