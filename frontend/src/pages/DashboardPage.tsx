import { DollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOnboardingData } from '@/lib/onboarding';
import { GetBudgetPeriods, GetBudgetAllocationsByBudgetPeriodID } from '@/wailsAdapter';
import { models } from '../../wailsjs/go/models';

export default function DashboardPage() {
  const [budgetPeriods, setBudgetPeriods] = useState<models.BudgetPeriod[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<models.BudgetPeriod | null>(null);
  const [allocations, setAllocations] = useState<models.BudgetAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const onboardingData = getOnboardingData();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const periods = await GetBudgetPeriods();
        setBudgetPeriods(periods || []);
        
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

  const totalAllocated = allocations.reduce((sum, a) => sum + a.allocatedAmount, 0);
  const envelopeCount = allocations.length;

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
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">
              No transactions yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">
              No transactions yet
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
              <div className="space-y-4">
                {allocations.map((allocation) => (
                  <div key={allocation.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">Category ID: {allocation.categoryId}</p>
                      <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: '0%' }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-medium">${allocation.allocatedAmount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">allocated</p>
                    </div>
                  </div>
                ))}
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
