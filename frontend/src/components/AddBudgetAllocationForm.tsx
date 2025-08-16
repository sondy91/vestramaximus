import React, { useState, useEffect } from 'react';
import { models } from '../../wailsjs/go/models';
import { AddBudgetAllocation, UpdateBudgetAllocation } from '../wailsAdapter';

interface AddBudgetAllocationFormProps {
  budgetPeriodId: number;
  categories: models.Category[];
  onAllocationModified: () => void;
  existingAllocations: models.BudgetAllocation[];
  allocationToEdit?: models.BudgetAllocation | null;
}

const AddBudgetAllocationForm: React.FC<AddBudgetAllocationFormProps> = ({
  budgetPeriodId,
  categories,
  onAllocationModified,
  existingAllocations,
  allocationToEdit,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [allocatedAmount, setAllocatedAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isEditMode = !!allocationToEdit;

  useEffect(() => {
    if (isEditMode && allocationToEdit) {
      setSelectedCategoryId(allocationToEdit.categoryId.toString());
      setAllocatedAmount(allocationToEdit.allocatedAmount.toString());
    } else {
      setSelectedCategoryId('');
      setAllocatedAmount('');
    }
  }, [allocationToEdit, isEditMode]);

  // Filter out categories that are already allocated, UNLESS it's the category of the item being edited.
  const availableCategories = categories.filter(category => 
    (isEditMode && allocationToEdit?.categoryId === category.id) || // Always allow the category being edited
    !existingAllocations.some(alloc => alloc.categoryId === category.id)
  );
  
  // Reset category selection if available categories change and not in edit mode, or if switching from edit to add mode.
  useEffect(() => {
    if (!isEditMode) {
        setSelectedCategoryId('');
    }
  // Ensure this effect runs correctly when availableCategories changes or when exiting edit mode.
  // Adding allocationToEdit to dependencies to re-evaluate when switching from edit to add.
  }, [availableCategories.length, isEditMode, allocationToEdit]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!selectedCategoryId && !isEditMode) { // Category selection is vital for add mode
      setError('Please select a category.');
      return;
    }
    // In edit mode, categoryId comes from allocationToEdit, amount is from state
    const categoryIdNum = isEditMode && allocationToEdit ? allocationToEdit.categoryId : parseInt(selectedCategoryId, 10);
    const amountNum = parseFloat(allocatedAmount);

    if (isNaN(amountNum) || amountNum < 0) { // Allow 0 for clearing out an allocation, or enforce >0 if preferred
      setError('Please enter a valid, non-negative amount.');
      return;
    }
    
    // Prevent adding a duplicate category if NOT in edit mode
    if (!isEditMode && existingAllocations.some(alloc => alloc.categoryId === categoryIdNum)) {
        setError('This category is already allocated for this budget period.');
        return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && allocationToEdit) {
        // For update, the backend expects the ID of the allocation and the new amount.
        // Our current Go `UpdateBudgetAllocation` takes a full BudgetAllocation model but only uses ID and AllocatedAmount.
        const updatedAllocation: models.BudgetAllocation = {
            ...allocationToEdit, // Spread existing fields
            allocatedAmount: amountNum,
            // categoryId will remain allocationToEdit.categoryId, not changeable in this UI for simplicity
        };
        await UpdateBudgetAllocation(updatedAllocation.id, updatedAllocation.allocatedAmount); // Send ID and new amount
      } else {
        await AddBudgetAllocation(budgetPeriodId, categoryIdNum, amountNum);
      }
      onAllocationModified();
      if (!isEditMode) { // Only reset form fully if in add mode
        setSelectedCategoryId('');
        setAllocatedAmount('');
      }
    } catch (err: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} budget allocation:`, err);
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'add'} budget allocation`);
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
          disabled={isEditMode} // Disable category change in edit mode for simplicity
        >
          <option value="" disabled={!isEditMode}>Select a category</option>
          {availableCategories.length === 0 && !isEditMode && <option value="" disabled>All categories allocated</option>}
          {availableCategories.map((category) => (
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
          min="0" // Allow 0 for editing, maybe to zero out an allocation
          required
        />
      </div>
      <button 
        type="submit" 
        disabled={isSubmitting || (!isEditMode && availableCategories.length === 0 && !selectedCategoryId)}>
        {isSubmitting ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Allocation' : 'Add Allocation')}
      </button>
    </form>
  );
};

export default AddBudgetAllocationForm; 