import React, { useState, useEffect } from 'react';
import { models } from '../../wailsjs/go/models';
import AddBudgetPeriodForm from '../components/AddBudgetPeriodForm';
import {
  GetBudgetPeriods,
  GetBudgetAllocationsByBudgetPeriodID,
  GetCategories,
  DeleteBudgetAllocation,
} from '../../wailsjs/go/main/App';
import AddBudgetAllocationForm from '../components/AddBudgetAllocationForm';

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

  const handleDeleteAllocation = async (allocationId: number) => {
    if (!selectedPeriod) return;
    if (window.confirm('Are you sure you want to delete this allocation?')) {
      try {
        await DeleteBudgetAllocation(allocationId);
        fetchAllocationsForSelectedPeriod();
      } catch (err: any) {
        console.error(`Error deleting allocation ${allocationId}:`, err);
        setAllocationsError(err.message || 'Failed to delete allocation');
      }
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
        <table className="clickable-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {budgetPeriods.map((period) => (
              <tr 
                key={period.id} 
                onClick={() => handlePeriodSelect(period)}
                className={selectedPeriod?.id === period.id ? 'selected-row' : ''}
              >
                <td>{period.id}</td>
                <td>{period.name}</td>
                <td>{new Date(period.startDate).toLocaleDateString()}</td>
                <td>{new Date(period.endDate).toLocaleDateString()}</td>
                <td>{period.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedPeriod && (
        <div style={{ marginTop: '30px' }}>
          <hr />
          <h3>Allocations for: {selectedPeriod.name}</h3>
          {isLoadingAllocations && <p>Loading allocations...</p>}
          {allocationsError && <p style={{ color: 'red' }}>Error: {allocationsError}</p>}
          {!isLoadingAllocations && !allocationsError && allocations.length === 0 && !editingAllocation && !showAddAllocationForm && (
            <p>No allocations found for this period.</p>
          )}
          {(!isLoadingAllocations && !allocationsError && allocations.length > 0) && (
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Allocated Amount</th>
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
                      <button onClick={() => handleDeleteAllocation(alloc.id)} className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          <div style={{ marginTop: '20px' }}>
            {!editingAllocation && !showAddAllocationForm && allocations.length > 0 && (
                 <button onClick={handleShowAddAllocationForm}>Add New Allocation</button>
            )}
            {(!editingAllocation && !showAddAllocationForm && allocations.length === 0) && (
                <p>No allocations yet. <button onClick={handleShowAddAllocationForm} className="link-button">Add one?</button></p>
            )}

            {(showAddAllocationForm || editingAllocation) && (
              <> 
                <h4>{editingAllocation ? 'Edit Allocation' : 'Add New Allocation'}</h4>
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
    </div>
  );
};

export default BudgetPage; 