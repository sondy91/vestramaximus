import React, { useState, useEffect } from 'react';
import { models } from '../../wailsjs/go/models';
import AddBudgetPeriodForm from '../components/AddBudgetPeriodForm';
import {
  GetBudgetPeriods,
  GetBudgetAllocationsByBudgetPeriodID,
  GetCategories,
  DeleteBudgetAllocation,
} from '../wailsAdapter';
import { Button, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddBudgetAllocationForm from '../components/AddBudgetAllocationForm';
import ConfirmModal from '../components/ConfirmModal';
import BudgetPeriodItem from '../components/BudgetPeriodItem';

const BudgetPage: React.FC = () => {
  const [budgetPeriods, setBudgetPeriods] = useState<models.BudgetPeriod[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPeriod, setSelectedPeriod] = useState<models.BudgetPeriod | null>(null);
  const [allocations, setAllocations] = useState<models.BudgetAllocation[]>([]);
  const [isLoadingAllocations, setIsLoadingAllocations] = useState<boolean>(false);
  const [allocationsError, setAllocationsError] = useState<string | null>(null);

  const [categories, setCategories] = useState<models.Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [editingAllocation, setEditingAllocation] = useState<models.BudgetAllocation | null>(null);
  const [showAddAllocationForm, setShowAddAllocationForm] = useState<boolean>(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [allocationToDelete, setAllocationToDelete] = useState<number | null>(null);

  const fetchBudgetPeriods = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const periods = await GetBudgetPeriods();
      setBudgetPeriods(periods || []);
    } catch (err: any) {
      console.error('Error fetching budget periods:', err);
      setError(err.message || 'Failed to fetch budget periods');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    setCategoriesError(null);
    try {
      const cats = await GetCategories();
      setCategories(cats || []);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setCategoriesError(err.message || 'Failed to fetch categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchBudgetPeriods();
    fetchCategories();
  }, []);

  const handleBudgetPeriodAdded = () => {
    fetchBudgetPeriods();
  };

  const handlePeriodSelect = (period: models.BudgetPeriod) => {
    setSelectedPeriod(period);
    setEditingAllocation(null);
    setShowAddAllocationForm(false);
  };

  const fetchAllocationsForSelectedPeriod = async () => {
    if (!selectedPeriod) return;
    setIsLoadingAllocations(true);
    setAllocationsError(null);
    try {
      const fetchedAllocations = await GetBudgetAllocationsByBudgetPeriodID(selectedPeriod.id);
      setAllocations(fetchedAllocations || []);
    } catch (err: any) {
      console.error(`Error fetching allocations for period ${selectedPeriod.id}:`, err);
      setAllocationsError(err.message || 'Failed to fetch allocations');
    } finally {
      setIsLoadingAllocations(false);
    }
  };

  useEffect(() => {
    if (selectedPeriod) {
      fetchAllocationsForSelectedPeriod();
    } else {
      setAllocations([]);
    }
  }, [selectedPeriod]);

  const handleAllocationModified = () => {
    setEditingAllocation(null);
    setShowAddAllocationForm(false);
    if (selectedPeriod) {
      fetchAllocationsForSelectedPeriod();
    }
  };

  const handleEditAllocationClick = (allocation: models.BudgetAllocation) => {
    setEditingAllocation(allocation);
    setShowAddAllocationForm(false);
  };
  
  const handleShowAddAllocationForm = () => {
    setEditingAllocation(null);
    setShowAddAllocationForm(true);
  }

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const requestDeleteAllocation = (id: number) => {
    setAllocationToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteAllocation = async () => {
    if (allocationToDelete === null) return;
    try {
      await DeleteBudgetAllocation(allocationToDelete);
      fetchAllocationsForSelectedPeriod();
    } catch (err: any) {
      console.error(`Error deleting allocation ${allocationToDelete}:`, err);
      setAllocationsError(err.message || 'Failed to delete allocation');
    } finally {
      setIsConfirmModalOpen(false);
      setAllocationToDelete(null);
    }
  };

  const cancelDeleteAllocation = () => {
    setIsConfirmModalOpen(false);
    setAllocationToDelete(null);
  };

  return (
    <div className="page">
      <h2>Budget Management</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>Create New Budget Period</h3>
        <AddBudgetPeriodForm onBudgetPeriodAdded={handleBudgetPeriodAdded} />
      </div>

      <hr />

      <h3>Existing Budget Periods</h3>
      {isLoading && <p>Loading budget periods...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!isLoading && !error && budgetPeriods.length === 0 && (
        <p>No budget periods found. Create one to get started!</p>
      )}
      {!isLoading && !error && budgetPeriods.length > 0 && (
        <div className="budget-period-list">
          {budgetPeriods.map((period) => (
            <BudgetPeriodItem
              key={period.id}
              period={period}
              isSelected={selectedPeriod?.id === period.id}
              onClick={handlePeriodSelect}
            />
          ))}
        </div>
      )}

      {selectedPeriod && (
        <div style={{ marginTop: '30px' }}>
          <hr />
          <h3>Envelopes for: {selectedPeriod.name}</h3>
          {isLoadingAllocations && <p>Loading envelopes...</p>}
          {allocationsError && <p style={{ color: 'red' }}>Error: {allocationsError}</p>}
          {!isLoadingAllocations && !allocationsError && allocations.length === 0 && !editingAllocation && !showAddAllocationForm && (
            <p>No envelopes found for this period.</p>
          )}
          {(!isLoadingAllocations && !allocationsError && allocations.length > 0) && (
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Budgeted Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((alloc) => (
                  <tr key={alloc.id}>
                    <td>{getCategoryName(alloc.categoryId)}</td>
                    <td>{alloc.allocatedAmount.toFixed(2)}</td>
                    <td>
                      <button onClick={() => handleEditAllocationClick(alloc)} className="btn-edit">Edit</button>
                      <button onClick={() => requestDeleteAllocation(alloc.id)} className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          <div style={{ marginTop: '20px' }}>
            {!editingAllocation && !showAddAllocationForm && allocations.length > 0 && (
                 <button onClick={handleShowAddAllocationForm}>Add Envelope</button>
            )}
            {(!editingAllocation && !showAddAllocationForm && allocations.length === 0) && (
                <p>No envelopes yet. <button onClick={handleShowAddAllocationForm} className="link-button">Add one?</button></p>
            )}

            {(showAddAllocationForm || editingAllocation) && (
              <> 
                <h4>{editingAllocation ? 'Edit Envelope' : 'Add Envelope'}</h4>
                {isLoadingCategories && <p>Loading categories for form...</p>}
                {categoriesError && <p style={{ color: 'red' }}>{categoriesError}</p>}
                {!isLoadingCategories && !categoriesError && (
                  <AddBudgetAllocationForm 
                    budgetPeriodId={selectedPeriod.id} 
                    categories={categories} 
                    existingAllocations={allocations}
                    onAllocationModified={handleAllocationModified}
                    allocationToEdit={editingAllocation}
                  />
                )}
                <button onClick={() => { setEditingAllocation(null); setShowAddAllocationForm(false); }} style={{marginTop: '10px'}}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this envelope? This action cannot be undone."
        onConfirm={confirmDeleteAllocation}
        onCancel={cancelDeleteAllocation}
        confirmText="Delete"
      />
    </div>
  );
};

export default BudgetPage; 