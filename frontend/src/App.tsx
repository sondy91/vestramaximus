import { useEffect, useMemo, useState } from 'react';
import './App.css';
import AppShell from './components/layout/AppShell';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { getOnboardingData, hasCompletedOnboarding, hasSeededBudget, markBudgetSeeded } from './lib/onboarding';
import { seedInitialBudget } from './lib/seedBudget';
import AccountsPage from './pages/AccountsPage';
import BudgetPage from './pages/BudgetPage';
import CategoriesPage from './pages/CategoriesPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import TransactionsPage from './pages/TransactionsPage';
import WelcomePage from './pages/WelcomePage';

// Define possible views/pages
type View = 'Dashboard' | 'Accounts' | 'Categories' | 'Transactions' | 'Budgets' | 'Reports' | 'Settings';

function App() {
    const [hasOnboarded, setHasOnboarded] = useState(() => hasCompletedOnboarding());
    const [currentView, setCurrentView] = useState<View>('Dashboard');
    const [isSeeding, setIsSeeding] = useState(false);

    // Seed initial budget on first app entry after onboarding
    useEffect(() => {
        async function initializeBudget() {
            if (hasOnboarded && !hasSeededBudget()) {
                setIsSeeding(true);
                try {
                    const data = getOnboardingData();
                    if (data) {
                        await seedInitialBudget(data);
                        markBudgetSeeded();
                        console.log('Initial budget seeded successfully');
                    }
                } catch (error) {
                    console.error('Failed to seed initial budget:', error);
                    // Don't block app, user can manually create budget
                } finally {
                    setIsSeeding(false);
                }
            }
        }
        initializeBudget();
    }, [hasOnboarded]);

    const content = useMemo(() => {
        switch (currentView) {
            case 'Dashboard':
                return <DashboardPage onNavigate={setCurrentView} />;
            case 'Accounts':
                return <AccountsPage />;
            case 'Categories':
                return <CategoriesPage />;
            case 'Transactions':
                return <TransactionsPage />;
            case 'Budgets':
                return <BudgetPage />;
            case 'Reports':
                return <ReportsPage />;
            case 'Settings':
                return <SettingsPage />;
            default:
                return <DashboardPage onNavigate={setCurrentView} />;
        }
    }, [currentView]);

    if (!hasOnboarded) {
        return (
            <ThemeProvider>
                <WelcomePage onGetStarted={() => setHasOnboarded(true)} />
            </ThemeProvider>
        );
    }

    if (isSeeding) {
        return (
            <ThemeProvider>
                <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-2">Setting up your budget...</h2>
                        <p className="text-muted-foreground">This will only take a moment.</p>
                    </div>
                </div>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider>
            <AppShell currentView={currentView} onNavigate={setCurrentView}>
                {content}
            </AppShell>
        </ThemeProvider>
    );
}

export default App;
