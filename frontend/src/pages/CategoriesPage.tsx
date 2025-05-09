import React, { useState, useEffect, useCallback } from 'react';
// Corrected Wails bindings path
import { GetCategories } from '../../wailsjs/go/main/App';
import { models } from '../../wailsjs/go/models';

import AddCategoryForm from '../components/AddCategoryForm';

type Category = models.Category;

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await GetCategories();
            setCategories(result || []);
        } catch (err: any) {
            console.error("Error fetching categories:", err);
            setError(err.message || 'Failed to fetch categories');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleCategoryAdded = () => {
        fetchCategories(); // Refresh the list
        setShowAddForm(false); // Optionally hide form
    };

    // Helper to find parent category name (can be expanded for full hierarchy later)
    const getParentCategoryName = (parentId: number | null | undefined): string => {
        if (!parentId) return 'N/A';
        const parent = categories.find(cat => cat.id === parentId);
        return parent ? parent.name : 'Unknown';
    };

    return (
        <div className="page-container">
            <h2>Categories Management</h2>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setShowAddForm(!showAddForm)} style={{ marginRight: '10px' }}>
                    {showAddForm ? 'Cancel' : 'Add New Category'}
                </button>
                <button onClick={fetchCategories} disabled={isLoading}>
                    {isLoading ? 'Refreshing...' : 'Refresh List'}
                </button>
            </div>

            {showAddForm && <AddCategoryForm onCategoryAdded={handleCategoryAdded} />}

            {isLoading && <p>Loading categories...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {!isLoading && !error && categories.length === 0 && !showAddForm && (
                <p>No categories found. Click "Add New Category" to get started.</p>
            )}

            {!isLoading && !error && categories.length > 0 && (
                <table className="categories-table"> {/* Use a distinct class */}
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Parent Category</th>
                            {/* Add Actions column later (Edit/Delete) */}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>{category.type}</td>
                                <td>{getParentCategoryName(category.parentCategoryId)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CategoriesPage; 