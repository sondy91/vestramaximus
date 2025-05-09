import { useState } from 'react';
import './App.css';
import AccountsPage from './pages/AccountsPage';
import CategoriesPage from './pages/CategoriesPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetPage from './pages/BudgetPage';

// Define possible views/pages
type View = 'Dashboard' | 'Accounts' | 'Categories' | 'Transactions' | 'Budgets' | 'Reports' | 'Settings';

function App() {
    // State to track the current active view
    const [currentView, setCurrentView] = useState<View>('Dashboard'); // Default view

    // Function to render the component based on the current view
    const renderView = () => {
        switch (currentView) {
            case 'Accounts':
                return <AccountsPage />;
            case 'Categories':
                return <CategoriesPage />;
            case 'Transactions':
                return <TransactionsPage />;
            case 'Budgets':
                return <BudgetPage />;
            // Add cases for other views later
            case 'Dashboard':
            default:
                return (
                    <div>
                        <h1>Welcome!</h1>
                        <p>Select an option from the sidebar.</p>
                    </div>
                );
        }
    };

    return (
        <div id="app" className="app-container">
            <div className="sidebar">
                <h2>VestraMaximus</h2>
                <nav>
                    <ul>
                        {/* Update list items to set the view on click */}
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
            <div className="main-content">
                {/* Render the component based on the current view state */}
                {renderView()}
            </div>
        </div>
    );
}

export default App;
