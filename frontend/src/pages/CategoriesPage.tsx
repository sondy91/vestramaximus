import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FolderTree, Plus, Tag } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { models } from '../../wailsjs/go/models';
import AddCategoryForm from '../components/AddCategoryForm';
import { GetCategories } from '../wailsAdapter';

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
        fetchCategories();
        setShowAddForm(false);
    };

    const getParentCategoryName = (parentId: number | null | undefined): string => {
        if (!parentId) return '-';
        const parent = categories.find(cat => cat.id === parentId);
        return parent ? parent.name : 'Unknown';
    };

    return (
        <div className="page-container max-w-7xl mx-auto py-8 px-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your income and expense categories.
                    </p>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? 'Cancel' : <><Plus className="mr-2 h-4 w-4" /> Add Category</>}
                </Button>
            </div>

            {showAddForm && (
                <Card className="mb-8 border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <AddCategoryForm onCategoryAdded={handleCategoryAdded} categories={categories} />
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading && <p className="text-muted-foreground">Loading categories...</p>}
                    {error && <p className="text-destructive">Error: {error}</p>}

                    {!isLoading && !error && categories.length === 0 && !showAddForm && (
                        <div className="text-center py-12">
                            <Tag className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
                            <p className="text-muted-foreground mb-4">No categories found.</p>
                            <Button onClick={() => setShowAddForm(true)} variant="outline">
                                Create your first category
                            </Button>
                        </div>
                    )}

                    {!isLoading && !error && categories.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Parent Category</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium flex items-center">
                                            <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {category.name}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                category.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {category.type}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {category.parentCategoryId ? (
                                                <div className="flex items-center text-muted-foreground">
                                                    <FolderTree className="mr-2 h-3 w-3" />
                                                    {getParentCategoryName(category.parentCategoryId)}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CategoriesPage; 