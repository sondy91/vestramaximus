// A thin adapter over Wails-generated functions that also falls back to window.go.main.App
// This stabilizes imports in tests and in environments where the generated module may not be ready.

// Import the generated Wails bindings if available in the build context
// The path is relative to src/: ../wailsjs/go/main/App
import * as WailsApp from '../wailsjs/go/main/App';

// Helper to call either window.go.main.App or the imported Wails module
const call = (fnName: string) => async (...args: any[]) => {
  const winApp = (globalThis as any)?.go?.main?.App;
  if (winApp && typeof winApp[fnName] === 'function') {
    return await winApp[fnName](...args);
  }
  const modFn = (WailsApp as any)[fnName];
  if (typeof modFn === 'function') {
    return await modFn(...args);
  }
  throw new Error(`Wails adapter: function not available: ${fnName}`);
};

// Export the specific functions currently used by the app
export const GetAccounts = call('GetAccounts');
export const GetTransactions = call('GetTransactions');
export const GetCategories = call('GetCategories');
export const AddCategory = call('AddCategory');
export const AddAccount = call('AddAccount');
export const DeleteAccount = call('DeleteAccount');
export const AddTransaction = call('AddTransaction');

export const GetBudgetPeriods = call('GetBudgetPeriods');
export const AddBudgetPeriod = call('AddBudgetPeriod');
export const UpdateBudgetPeriod = call('UpdateBudgetPeriod');

export const GetBudgetAllocationsByBudgetPeriodID = call('GetBudgetAllocationsByBudgetPeriodID');
export const AddBudgetAllocation = call('AddBudgetAllocation');
export const UpdateBudgetAllocation = call('UpdateBudgetAllocation');
export const DeleteBudgetAllocation = call('DeleteBudgetAllocation');

// Envelope-related (future-proof)
export const CreateEnvelope = call('CreateEnvelope');

// Data management
export const ClearAllData = call('ClearAllData');
