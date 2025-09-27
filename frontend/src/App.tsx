import { useMemo, useState } from 'react';
import './App.css';
import { ThemeProvider } from './components/theme/ThemeProvider';
import AccountsPage from './pages/AccountsPage';
import BudgetPage from './pages/BudgetPage';
import CategoriesPage from './pages/CategoriesPage';
import TransactionsPage from './pages/TransactionsPage';
import WelcomePage from './pages/WelcomePage';

// Define possible views/pages
type View = 'Dashboard' | 'Accounts' | 'Categories' | 'Transactions' | 'Budgets' | 'Reports' | 'Settings';

function App() {
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const [currentView, setCurrentView] = useState<View>('Dashboard');

    const content = useMemo(() => {
        switch (currentView) {
            case 'Accounts':
                return <AccountsPage />;
            case 'Categories':
                return <CategoriesPage />;
            case 'Transactions':
                return <TransactionsPage />;
            case 'Budgets':
                return <BudgetPage />;
            default:
                return (
                    <div className="text-left">
                        <h1>Dashboard</h1>
                        <p>Select an option from the sidebar to continue.</p>
                    </div>
                );
        }
    }, [currentView]);

    if (!hasOnboarded) {
        return (
            <ThemeProvider>
                <WelcomePage onGetStarted={() => setHasOnboarded(true)} />
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider>
            <div id="app" className="app-container">
                <div className="sidebar">
                    <h2>VestraMaximus</h2>
                    <nav>
                        <ul>
                            <li onClick={() => setCurrentView('Dashboard')}>Dashboard</li>
                            <li onClick={() => setCurrentView('Accounts')}>Accounts</li>
                            <li onClick={() => setCurrentView('Categories')}>Categories</li>
                            <li onClick={() => setCurrentView('Transactions')}>Transactions</li>
                            <li onClick={() => setCurrentView('Budgets')}>Budgets</li>
                            <li onClick={() => setCurrentView('Reports')}>Reports</li>
                            <li onClick={() => setCurrentView('Settings')}>Settings</li>
                        </ul>
                    </nav>
                </div>
                <div className="main-content">{content}</div>
            </div>
        </ThemeProvider>
    );
}

export default App;
