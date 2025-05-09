import React, { useState, useEffect } from 'react';
// Corrected Wails bindings path
import { AddCategory, GetCategories } from '../../wailsjs/go/main/App';
import { models } from '../../wailsjs/go/models';

type Category = models.Category; // Assuming models.Category is available

interface AddCategoryFormProps {
    onCategoryAdded: () => void;
}

interface CategoryFormData {
    name: string;
    type: 'Income' | 'Expense';
    parentCategoryID: string; // Store as string, "0" or "" for no parent
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ onCategoryAdded }) => {
    const [formData, setFormData] = useState<CategoryFormData>({
        name: '',
        type: 'Expense', // Default type
        parentCategoryID: "0", // Default to no parent
    });
    const [existingCategories, setExistingCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch existing categories for the parent dropdown
    useEffect(() => {
        const fetchExistingCategories = async () => {
            try {
                const cats = await GetCategories();
                setExistingCategories(cats || []);
            } catch (err) {
                console.error("Error fetching existing categories for form:", err);
                // Handle error, maybe disable parent selection or show a message
            }
        };
        fetchExistingCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        if (!formData.name.trim()) {
            setError('Category name cannot be empty.');
            setIsSubmitting(false);
            return;
        }

        // Convert parentCategoryID to *int64 for Go: null if "0" or empty, else parsed int.
        let parentID: number | null = parseInt(formData.parentCategoryID, 10);
        if (isNaN(parentID) || parentID === 0) {
            parentID = null;
        }

        try {
            // The Go function AddCategory expects: name, categoryType, parentCategoryID (*int64)
            // Wails handles the pointer conversion for null if we pass null from JS.
            const createdCategory: models.Category = await AddCategory(
                formData.name,
                formData.type,
                parentID // Pass the processed parentID
            );

            setSuccessMessage(`Category "${createdCategory.name}" added successfully!`);
            setFormData({ name: '', type: 'Expense', parentCategoryID: "0" }); // Reset form
            onCategoryAdded(); // Trigger callback
             // Re-fetch categories for the dropdown to include the new one
            const cats = await GetCategories();
            setExistingCategories(cats || []);

        } catch (err: any) {
            console.error("Error adding category:", err);
            setError(err.message || 'Failed to add category. Name might be taken.');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-category-form"> {/* Use a distinct class */}
            <h3>Add New Category</h3>
            {error && <p className="form-error">Error: {error}</p>}
            {successMessage && <p className="form-success">{successMessage}</p>}

            <div className="form-group">
                <label htmlFor="name">Category Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="type">Category Type:</label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="parentCategoryID">Parent Category (Optional):</label>
                <select
                    id="parentCategoryID"
                    name="parentCategoryID"
                    value={formData.parentCategoryID}
                    onChange={handleInputChange}
                >
                    <option value="0">-- No Parent --</option>
                    {existingCategories.map(cat => (
                        <option key={cat.id} value={cat.id.toString()}>
                            {cat.name} ({cat.type})
                        </option>
                    ))}
                </select>
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Category'}
            </button>
        </form>
    );
};

export default AddCategoryForm; 