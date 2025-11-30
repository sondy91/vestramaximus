import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GetCategories, GetTransactions } from '@/wailsAdapter';
import { useEffect, useMemo, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { models } from '../../wailsjs/go/models';

export default function ReportsPage() {
    const [transactions, setTransactions] = useState<models.Transaction[]>([]);
    const [categories, setCategories] = useState<models.Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [txs, cats] = await Promise.all([
                    GetTransactions(),
                    GetCategories(),
                ]);
                setTransactions(txs || []);
                setCategories(cats || []);
            } catch (error) {
                console.error('Failed to load report data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // 1. Income vs Expenses by Month
    const monthlyData = useMemo(() => {
        const data: Record<string, { name: string; income: number; expense: number }> = {};

        transactions.forEach((t) => {
            const date = new Date(t.date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });

            if (!data[key]) {
                data[key] = { name: monthName, income: 0, expense: 0 };
            }

            if (t.type === 'Income') {
                data[key].income += Math.abs(t.amount);
            } else {
                data[key].expense += Math.abs(t.amount);
            }
        });

        return Object.values(data).sort((a, b) => a.name.localeCompare(b.name)); // Basic sort, might need better date sorting
    }, [transactions]);

    // 2. Spending by Category
    const categoryData = useMemo(() => {
        const data: Record<number, number> = {};

        transactions
            .filter((t) => t.type === 'Expense')
            .forEach((t) => {
                data[t.categoryId] = (data[t.categoryId] || 0) + Math.abs(t.amount);
            });

        return Object.entries(data)
            .map(([catId, amount]) => {
                const category = categories.find((c) => c.id === parseInt(catId));
                return {
                    name: category ? category.name : `ID: ${catId}`,
                    value: amount,
                };
            })
            .sort((a, b) => b.value - a.value); // Sort by highest spending
    }, [transactions, categories]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Loading reports...</p>
            </div>
        );
    }

    return (
        <div className="page-container max-w-7xl mx-auto py-8 px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                <p className="text-muted-foreground mt-2">
                    Visual insights into your financial health.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Income vs Expenses Chart */}
                <Card className="col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Income vs Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={monthlyData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="income" name="Income" fill="#22c55e" />
                                    <Bar dataKey="expense" name="Expenses" fill="#ef4444" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Spending by Category Chart */}
                <Card className="col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Spending by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
