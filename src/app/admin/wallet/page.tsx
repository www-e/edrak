"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSnackbar } from "@/components/shared/snackbar-context";
import { Loader2, Search, Wallet, History, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminWalletPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  const utils = api.useUtils();

  // Queries
  const { data: userBalance, isLoading: isLoadingBalance } = api.admin.commerce.getUserWalletBalance.useQuery(
    { userId: selectedUser! },
    { enabled: !!selectedUser }
  );

  const { data: transactions, isLoading: isLoadingTransactions } = api.admin.commerce.getUserWalletTransactions.useQuery(
    { userId: selectedUser! },
    { enabled: !!selectedUser }
  );

  // Mutations
  const adjustWallet = api.admin.commerce.adjustUserWallet.useMutation({
    onSuccess: () => {
      showSnackbar("Wallet balance adjusted successfully", "success");
      setIsDialogOpen(false);
      setAmount("");
      setDescription("");
      utils.admin.commerce.getUserWalletBalance.invalidate({ userId: selectedUser! });
      utils.admin.commerce.getUserWalletTransactions.invalidate({ userId: selectedUser! });
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to adjust wallet balance", "error");
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd search for users. For now, we'll assume the query is a User ID.
    if (searchQuery) {
      setSelectedUser(searchQuery);
    }
  };

  const handleAdjustment = () => {
    if (!selectedUser || !amount || !description) return;

    const signedAmount = adjustmentType === "CREDIT" 
      ? Math.abs(parseFloat(amount)) 
      : -Math.abs(parseFloat(amount));

    adjustWallet.mutate({
      userId: selectedUser,
      amount: signedAmount,
      reason: description,
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Wallet className="w-8 h-8" />
          Wallet Management
        </h1>
      </div>

      {/* User Search */}
      <Card>
        <CardHeader>
          <CardTitle>Find User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter User ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {selectedUser && (
        <div className="grid gap-8 md:grid-cols-2">
          {/* Balance Card */}
          <Card>
            <CardHeader>
              <CardTitle>Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingBalance ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <div className="text-4xl font-bold text-primary">
                  {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(userBalance?.balance || 0)}
                </div>
              )}
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4 w-full">Adjust Balance</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adjust Wallet Balance</DialogTitle>
                    <DialogDescription>
                      Add or remove funds from the user&apos;s wallet.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select 
                        value={adjustmentType} 
                        onValueChange={(val: "CREDIT" | "DEBIT") => setAdjustmentType(val)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CREDIT">Credit (Add Funds)</SelectItem>
                          <SelectItem value="DEBIT">Debit (Remove Funds)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Amount (EGP)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Reason for adjustment..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAdjustment} disabled={adjustWallet.isPending}>
                      {adjustWallet.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Confirm Adjustment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions?.transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {tx.type.includes('CREDIT') || tx.type === 'REFUND_CREDIT' ? (
                              <ArrowUpCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <ArrowDownCircle className="w-4 h-4 text-red-600" />
                            )}
                            {tx.type}
                          </div>
                        </TableCell>
                        <TableCell className={tx.amount > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                          {tx.amount > 0 ? "+" : ""}{new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(tx.amount)}
                        </TableCell>
                        <TableCell>{tx.description}</TableCell>
                      </TableRow>
                    ))}
                    {transactions?.transactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
