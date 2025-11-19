import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { models } from '../../wailsjs/go/models';
import { AddCategory, GetCategories } from '../wailsAdapter';

type Category = models.Category;

interface AddCategoryFormProps {
    onCategoryAdded: () => void;
    categories?: Category[];
}

interface CategoryFormData {
    name: string;
    type: 'Income' | 'Expense';
    parentCategoryID: string;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ onCategoryAdded, categories: propCategories }) => {
    const [formData, setFormData] = useState<CategoryFormData>({
        name: '',
        type: 'Expense',
        parentCategoryID: "0",
    });
    const [existingCategories, setExistingCategories] = useState<Category[]>(propCategories || []);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!propCategories) {
            const fetchExistingCategories = async () => {
                try {
                    const cats = await GetCategories();
                    setExistingCategories(cats || []);
                } catch (err) {
                    console.error("Error fetching existing categories for form:", err);
                }
            };
            fetchExistingCategories();
        } else {
            setExistingCategories(propCategories);
        }
    }, [propCategories]);

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

        let parentID: number | null = parseInt(formData.parentCategoryID, 10);
        if (isNaN(parentID) || parentID === 0) {
            parentID = null;
        }

        try {
            const createdCategory: models.Category = await AddCategory(
                formData.name,
                formData.type,
                parentID
            );

            setSuccessMessage(`Category "${createdCategory.name}" added successfully!`);
            setFormData({ name: '', type: 'Expense', parentCategoryID: "0" });
            onCategoryAdded();
            
            if (!propCategories) {
                const cats = await GetCategories();
                setExistingCategories(cats || []);
            }

        } catch (err: any) {
            console.error("Error adding category:", err);
            setError(err.message || 'Failed to add category. Name might be taken.');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Add New Category</h3>
            </div>

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            {successMessage && <p className="text-sm font-medium text-green-600 dark:text-green-400">{successMessage}</p>}

            <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Groceries"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Category Type</Label>
                    <Select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                    >
                        <option value="Expense">Expense</option>
                        <option value="Income">Income</option>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="parentCategoryID">Parent Category (Optional)</Label>
                    <Select
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
                    </Select>
                </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Adding...' : 'Add Category'}
            </Button>
        </form>
    );
};

export default AddCategoryForm; 