import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Edit2, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { models } from '../../wailsjs/go/models';
import AddBudgetPeriodForm from '../components/AddBudgetPeriodForm';
import {
    DeleteBudgetAllocation,
    GetBudgetAllocationsByBudgetPeriodID,
    GetBudgetPeriods,
    GetCategories,
} from '../wailsAdapter';

import AddBudgetAllocationForm from '../components/AddBudgetAllocationForm';
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

  return (
    <div className="page-container max-w-7xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your budget periods and envelope allocations.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-[350px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Period</CardTitle>
            </CardHeader>
            <CardContent>
              <AddBudgetPeriodForm onBudgetPeriodAdded={handleBudgetPeriodAdded} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Periods</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <p className="text-muted-foreground">Loading budget periods...</p>}
              {error && <p className="text-destructive">Error: {error}</p>}
              {!isLoading && !error && budgetPeriods.length === 0 && (
                <p className="text-muted-foreground">No budget periods found. Create one to get started!</p>
              )}
              {!isLoading && !error && budgetPeriods.length > 0 && (
                <div className="space-y-2">
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {selectedPeriod ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Envelopes for: {selectedPeriod.name}</CardTitle>
                {!editingAllocation && !showAddAllocationForm && (
                  <Button onClick={handleShowAddAllocationForm} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Envelope
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isLoadingAllocations && <p className="text-muted-foreground">Loading envelopes...</p>}
                {allocationsError && <p className="text-destructive">Error: {allocationsError}</p>}
                
                {(showAddAllocationForm || editingAllocation) ? (
                  <div className="bg-muted/30 p-6 rounded-lg border">
                    <h4 className="text-lg font-semibold mb-4">{editingAllocation ? 'Edit Envelope' : 'Add Envelope'}</h4>
                    {isLoadingCategories && <p>Loading categories for form...</p>}
                    {categoriesError && <p className="text-destructive">{categoriesError}</p>}
                    {!isLoadingCategories && !categoriesError && (
                      <AddBudgetAllocationForm 
                        budgetPeriodId={selectedPeriod.id} 
                        categories={categories} 
                        existingAllocations={allocations}
                        onAllocationModified={handleAllocationModified}
                        allocationToEdit={editingAllocation}
                      />
                    )}
                    <Button 
                      variant="ghost" 
                      onClick={() => { setEditingAllocation(null); setShowAddAllocationForm(false); }} 
                      className="mt-4"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    {!isLoadingAllocations && !allocationsError && allocations.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No envelopes found for this period.</p>
                        <Button onClick={handleShowAddAllocationForm} variant="outline">
                          Create your first envelope
                        </Button>
                      </div>
                    )}
                    {!isLoadingAllocations && !allocationsError && allocations.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Budgeted Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allocations.map((alloc) => (
                            <TableRow key={alloc.id}>
                              <TableCell className="font-medium">{getCategoryName(alloc.categoryId)}</TableCell>
                              <TableCell>${alloc.allocatedAmount.toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleEditAllocationClick(alloc)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => requestDeleteAllocation(alloc.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-semibold mb-2">No Period Selected</h3>
                <p className="text-muted-foreground">Select a budget period from the list to view its envelopes.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AlertDialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the envelope allocation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAllocationToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAllocation} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BudgetPage; 