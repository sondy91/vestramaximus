import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import BudgetPage from '../../pages/BudgetPage';
import * as Adapter from '../../wailsAdapter';
// Mock adapter BEFORE importing the component under test
vi.mock('../../wailsAdapter', () => ({
  GetBudgetPeriods: vi.fn(),
  GetBudgetAllocationsByBudgetPeriodID: vi.fn(),
  GetCategories: vi.fn(),
  DeleteBudgetAllocation: vi.fn(),
}));

// Wails API mocked via vi.mock; implementations set in beforeEach

describe('BudgetPage', () => {
  const mockBudgetPeriods = [
    {
      id: 1,
      name: 'August 2025',
      startDate: '2025-08-01T00:00:00Z',
      endDate: '2025-08-31T23:59:59Z',
      status: 'Open',
    },
  ];

  const mockCategories = [
    { id: 1, name: 'Groceries', type: 'Expense' },
    { id: 2, name: 'Rent', type: 'Expense' },
  ];

  const mockAllocations = [
    {
      id: 1,
      budgetPeriodId: 1,
      categoryId: 1,
      allocatedAmount: 500.0,
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Set up default mock implementations on mocked adapter API
    (Adapter.GetBudgetPeriods as unknown as Mock).mockResolvedValue(mockBudgetPeriods as any);
    (Adapter.GetCategories as unknown as Mock).mockResolvedValue(mockCategories as any);
    (Adapter.GetBudgetAllocationsByBudgetPeriodID as unknown as Mock).mockResolvedValue(mockAllocations as any);

    // No need to stub window.go when mocking the adapter directly
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially', async () => {
    render(<BudgetPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  it('displays budget periods after loading', async () => {
    render(<BudgetPage />);
    // should render the period name once data resolves
    const period = await screen.findByText('August 2025');
    expect(period).toBeInTheDocument();
    expect(screen.queryByText(/No budget periods found/i)).not.toBeInTheDocument();
  });

  it('shows allocations when a budget period is selected', async () => {
    render(<BudgetPage />);
    
    // Wait for budget periods to load
    const periodButton = await screen.findByText('August 2025');
    await userEvent.click(periodButton);
    
    // Check if allocations are displayed
    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('500.00')).toBeInTheDocument();
    });
  });
});
