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
import { formatMoney } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { models } from '../../wailsjs/go/models';
import AddTransactionForm from '../components/AddTransactionForm';
import { GetAccounts, GetCategories, GetTransactions } from '../wailsAdapter';

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<models.Transaction[]>([]);
  const [categories, setCategories] = useState<models.Category[]>([]);
  const [accounts, setAccounts] = useState<models.Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [txs, cats, accs] = await Promise.all([
        GetTransactions(),
        GetCategories(),
        GetAccounts()
      ]);
      setTransactions(txs || []);
      setCategories(cats || []);
      setAccounts(accs || []);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransactionAdded = () => {
    fetchData();
    setShowAddForm(false);
  };

  const getCategoryName = (id: number) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : `Category ${id}`;
  };

  const getAccountName = (id: number) => {
    const acc = accounts.find(a => a.id === id);
    return acc ? acc.name : `Account ${id}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="page-container max-w-7xl mx-auto py-8 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your income and expenses.
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : <><Plus className="mr-2 h-4 w-4" /> Add Transaction</>}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <AddTransactionForm
              onTransactionAdded={handleTransactionAdded}
              categories={categories}
              accounts={accounts}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground">Loading transactions...</p>}
          {error && <p className="text-destructive">Error: {error}</p>}

          {!isLoading && !error && transactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No transactions found.</p>
              <Button onClick={() => setShowAddForm(true)} variant="outline">
                Record your first transaction
              </Button>
            </div>
          )}

          {!isLoading && !error && transactions.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{formatDate(tx.date)}</TableCell>
                    <TableCell className="font-medium">{tx.description}</TableCell>
                    <TableCell>{getCategoryName(tx.categoryId)}</TableCell>
                    <TableCell>{getAccountName(tx.accountId)}</TableCell>
                    <TableCell className={`text-right font-medium ${tx.amount < 0 ? 'text-destructive' : 'text-green-600'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {tx.amount < 0 ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                        ${formatMoney(Math.abs(tx.amount))}
                      </div>
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

export default TransactionsPage;