/**
 * Initial budget seeding from onboarding wizard selections
 * Creates default budget period and categories based on user choices
 */

import { AddBudgetPeriod, AddCategory, AddBudgetAllocation } from '../wailsAdapter';
import type { OnboardingData } from './onboarding';

/**
 * Category mapping from wizard IDs to display names
 */
const CATEGORY_MAP: Record<string, string> = {
  groceries: 'Groceries',
  rent: 'Rent/Mortgage',
  utilities: 'Utilities',
  transportation: 'Transportation',
  entertainment: 'Entertainment',
  savings: 'Savings',
};

/**
 * Generate default budget period name for current month
 */
function getDefaultPeriodName(): string {
  const now = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${monthNames[now.getMonth()]} ${now.getFullYear()} Budget`;
}

/**
 * Get start and end dates for current month
 */
function getCurrentMonthDates(): { startDate: string; endDate: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const startDate = new Date(year, month, 1).toISOString();
  const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
  
  return { startDate, endDate };
}

/**
 * Seed initial budget from onboarding data
 * Creates:
 * 1. Default budget period for current month
 * 2. Categories from wizard selections
 * 3. Budget allocations ($0 initial) for each category
 */
export async function seedInitialBudget(data: OnboardingData): Promise<void> {
  try {
    console.log('Seeding initial budget from onboarding data:', data);
    
    // 1. Create default budget period
    const { startDate, endDate } = getCurrentMonthDates();
    const periodName = getDefaultPeriodName();
    
    const period = await AddBudgetPeriod(periodName, startDate, endDate, 'Open');
    console.log('Created budget period:', period);
    
    // 2. Create categories and allocations
    for (const categoryId of data.categories) {
      const categoryName = CATEGORY_MAP[categoryId];
      if (!categoryName) {
        console.warn(`Unknown category ID: ${categoryId}`);
        continue;
      }
      
      // Create category (type: Expense, no parent)
      const category = await AddCategory(categoryName, 'Expense', null);
      console.log(`Created category: ${categoryName}`, category);
      
      // Create $0 allocation for this category in the budget period
      const allocation = await AddBudgetAllocation(
        period.id,
        category.id,
        0.00
      );
      console.log(`Created allocation for ${categoryName}:`, allocation);
    }
    
    console.log('Initial budget seeding complete');
  } catch (error) {
    console.error('Failed to seed initial budget:', error);
    throw new Error(`Budget seeding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
