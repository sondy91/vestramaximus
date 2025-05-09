import React, { useState, useEffect } from 'react';
import { models } from '../../wailsjs/go/models';
import { AddBudgetAllocation, GetCategories } from '../../wailsjs/go/main/App';

interface AddBudgetAllocationFormProps {
  budgetPeriodId: number;
  categories: models.Category[]; // Will be passed from BudgetPage
  onAllocationAdded: () => void; // Callback to refresh allocations list
  existingAllocations: models.BudgetAllocation[]; // To prevent adding duplicate category allocations
}

const AddBudgetAllocationForm: React.FC<AddBudgetAllocationFormProps> = ({
  budgetPeriodId,
  categories,
  onAllocationAdded,
  existingAllocations,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(''); // Store as string for select value
  const [allocatedAmount, setAllocatedAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter out categories that are already allocated in the current period
  const availableCategories = categories.filter(category => 
    !existingAllocations.some(alloc => alloc.categoryId === category.id)
  );

  useEffect(() => {
    // Reset category selection if available categories change (e.g. after adding an allocation)
    setSelectedCategoryId('');
  }, [availableCategories.length]); // Dependency on length to catch additions/removals


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!selectedCategoryId) {
      setError('Please select a category.');
      return;
    }
    const categoryIdNum = parseInt(selectedCategoryId, 10);
    const amountNum = parseFloat(allocatedAmount);

    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    // Check if this category is already allocated for this budget period (client-side check)
    if (existingAllocations.some(alloc => alloc.categoryId === categoryIdNum)) {
        setError('This category is already allocated for this budget period. Please edit the existing allocation.');
        return;
    }

    setIsSubmitting(true);
    try {
      await AddBudgetAllocation(budgetPeriodId, categoryIdNum, amountNum);
      onAllocationAdded(); // Trigger refresh in parent
      // Reset form
      setSelectedCategoryId('');
      setAllocatedAmount('');
    } catch (err: any) {
      console.error('Error adding budget allocation:', err);
      setError(err.message || 'Failed to add budget allocation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="sub-form">
      {error && <p className="form-error">{error}</p>}
      <div className="form-group">
        <label htmlFor="ba-category">Category:</label>
        <select
          id="ba-category"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          required
        >
          <option value="" disabled>Select a category</option>
          {availableCategories.length === 0 && <option value="" disabled>All categories allocated</option>}
          {availableCategories.map((category) => (
            // Only show expense categories for budgeting, or make it configurable
            category.type === 'Expense' && (
                <option key={category.id} value={category.id.toString()}>
                {category.name}
                </option>
            )
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="ba-amount">Allocated Amount:</label>
        <input
          id="ba-amount"
          type="number"
          value={allocatedAmount}
          onChange={(e) => setAllocatedAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0.01"
          required
        />
      </div>
      <button type="submit" disabled={isSubmitting || availableCategories.length === 0}>
        {isSubmitting ? 'Adding...' : 'Add Allocation'}
      </button>
    </form>
  );
};

export default AddBudgetAllocationForm; 