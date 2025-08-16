// Type definitions for Wails API
interface Window {
  go: {
    main: {
      App: {
        GetEnvelopes: () => Promise<any[]>;
        CreateEnvelope: (envelope: any) => Promise<any>;
        UpdateEnvelope: (envelope: any) => Promise<any>;
        DeleteEnvelope: (id: number) => Promise<void>;
        GetBudgetPeriods: () => Promise<any[]>;
        GetBudgetAllocationsByBudgetPeriodID: (id: number) => Promise<any[]>;
        GetCategories: () => Promise<any[]>;
        DeleteBudgetAllocation: (id: number) => Promise<void>;
      };
    };
  };
}
