import { ArrowRight, DollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOnboardingData } from '@/lib/onboarding';
import { GetBudgetAllocationsByBudgetPeriodID, GetBudgetPeriods, GetCategories, GetTransactions } from '@/wailsAdapter';
import { models } from '../../wailsjs/go/models';

interface DashboardPageProps {
  onNavigate?: (view: 'Budgets') => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [budgetPeriods, setBudgetPeriods] = useState<models.BudgetPeriod[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<models.BudgetPeriod | null>(null);
  const [allocations, setAllocations] = useState<models.BudgetAllocation[]>([]);
  const [categories, setCategories] = useState<models.Category[]>([]);
  const [transactions, setTransactions] = useState<models.Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const onboardingData = getOnboardingData();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [periods, cats, txs] = await Promise.all([
          GetBudgetPeriods(),
          GetCategories(),
          GetTransactions()
        ]);
        
        setBudgetPeriods(periods || []);
        setCategories(cats || []);
        setTransactions(txs || []);
        
        // Get the most recent open period
        const openPeriods = (periods || []).filter((p: models.BudgetPeriod) => p.status === 'Open');
        if (openPeriods.length > 0) {
          const latest = openPeriods[0];
          setCurrentPeriod(latest);
          
          const allocs = await GetBudgetAllocationsByBudgetPeriodID(latest.id);
          setAllocations(allocs || []);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, []);

  // Calculate totals
  const totalAllocated = allocations.reduce((sum, a) => sum + a.allocatedAmount, 0);
  const envelopeCount = allocations.length;

  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Calculate spent per category for the current period
  const categorySpent = transactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<number, number>);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : `Category ID: ${categoryId}`;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-destructive';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-primary';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-container max-w-7xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your finances.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalAllocated.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {envelopeCount} envelope{envelopeCount !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Periods</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetPeriods.length}</div>
            <p className="text-xs text-muted-foreground">
              {currentPeriod ? currentPeriod.name : 'No active period'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total income recorded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total expenses recorded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Budget Period */}
      {currentPeriod && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Budget: {currentPeriod.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {allocations.length > 0 ? (
              <div className="space-y-6">
                {allocations.map((allocation) => {
                  const spent = categorySpent[allocation.categoryId] || 0;
                  const isZeroAllocation = allocation.allocatedAmount === 0;
                  
                  let percentage = 0;
                  if (!isZeroAllocation) {
                    percentage = Math.min((spent / allocation.allocatedAmount) * 100, 100);
                  }
                  
                  const remaining = allocation.allocatedAmount - spent;
                  
                  return (
                    <div key={allocation.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{getCategoryName(allocation.categoryId)}</p>
                        <div className="text-right">
                          {isZeroAllocation ? (
                             <span className="text-sm text-muted-foreground">Not Allocated</span>
                          ) : (
                            <>
                              <span className="text-sm font-medium">${spent.toFixed(2)}</span>
                              <span className="text-sm text-muted-foreground"> / ${allocation.allocatedAmount.toFixed(2)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {isZeroAllocation ? (
                        <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
                           <span className="text-xs text-muted-foreground">No funds allocated to this category yet.</span>
                           {onNavigate && (
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="h-6 text-xs" 
                               onClick={() => onNavigate('Budgets')}
                             >
                               Allocate <ArrowRight className="ml-1 h-3 w-3" />
                             </Button>
                           )}
                        </div>
                      ) : (
                        <>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${getProgressColor(percentage)}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{percentage.toFixed(0)}% Used</span>
                            <span>${remaining.toFixed(2)} Remaining</span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No envelopes created yet. Visit the Budgets page to set up your allocations.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Your Goals */}
      {onboardingData && onboardingData.goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Financial Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {onboardingData.goals.map((goal) => (
                <div
                  key={goal}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {goal === 'debt' && 'Pay off debt'}
                  {goal === 'emergency' && 'Build emergency fund'}
                  {goal === 'savings' && 'Save for a goal'}
                  {goal === 'budget' && 'Create a budget'}
                  {goal === 'other' && 'Something else'}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!currentPeriod && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Budget Period Found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              It looks like you haven't created a budget period yet. Get started by visiting the Budgets page.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
