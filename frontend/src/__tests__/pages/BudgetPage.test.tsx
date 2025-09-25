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

  it('shows empty states when there are no budget periods', async () => {
    (Adapter.GetBudgetPeriods as unknown as Mock).mockResolvedValueOnce([] as any);
    render(<BudgetPage />);
    const emptyMsg = await screen.findByText(/No budget periods found/i);
    expect(emptyMsg).toBeInTheDocument();
  });

  it('shows empty envelopes message and allows toggling Add form', async () => {
    (Adapter.GetBudgetAllocationsByBudgetPeriodID as unknown as Mock).mockResolvedValueOnce([] as any);
    render(<BudgetPage />);

    const periodButton = await screen.findByText('August 2025');
    await userEvent.click(periodButton);

    // Empty state for envelopes
    await screen.findByText(/No envelopes found for this period\./i);

    // The prompt with link button to add one
    const addOneLink = await screen.findByRole('button', { name: /Add one\?/i });
    await userEvent.click(addOneLink);

    // AddBudgetAllocationForm rendered (category label present)
    await screen.findByLabelText(/Category:/i);
  });

  it('handles delete flow via ConfirmModal', async () => {
    render(<BudgetPage />);

    const periodButton = await screen.findByText('August 2025');
    await userEvent.click(periodButton);

    // Click delete on the first row
    const delBtn = await screen.findByRole('button', { name: /Delete/i });
    await userEvent.click(delBtn);

    // Confirm modal appears with Delete button text
    const confirmBtn = await screen.findByRole('button', { name: /^Delete$/i });
    await userEvent.click(confirmBtn);

    expect(Adapter.DeleteBudgetAllocation).toHaveBeenCalledWith(1);
  });

  it('shows error when allocations fetch fails', async () => {
    (Adapter.GetBudgetAllocationsByBudgetPeriodID as unknown as Mock).mockRejectedValueOnce(new Error('boom'));
    render(<BudgetPage />);

    const periodButton = await screen.findByText('August 2025');
    await userEvent.click(periodButton);

    await screen.findByText(/Failed to fetch allocations/i);
  });

  it('shows categories error inside Add form when categories fetch fails', async () => {
    (Adapter.GetCategories as unknown as Mock).mockRejectedValueOnce(new Error('no cats'));
    (Adapter.GetBudgetAllocationsByBudgetPeriodID as unknown as Mock).mockResolvedValueOnce([] as any);
    render(<BudgetPage />);

    const periodButton = await screen.findByText('August 2025');
    await userEvent.click(periodButton);

    // Show add form
    const addOneLink = await screen.findByRole('button', { name: /Add one\?/i });
    await userEvent.click(addOneLink);

    await screen.findByText(/Failed to fetch categories/i);
  });
});
