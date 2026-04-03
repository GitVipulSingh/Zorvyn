import { useEffect } from "react";
import { Plus } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useMonthlyStats } from "@/hooks/useMonthlyStats";
import { ExpenseList } from "@/components/ExpenseList";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";

export function Activity() {
  const { transactions, user, loadTransactions } = useFinanceStore();
  const { monthlyTotal } = useMonthlyStats(transactions);

  useEffect(() => {
    loadTransactions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} &middot; This month:{" "}
            <span className="font-semibold text-gray-700">
              {formatCurrency(monthlyTotal, user.currency)}
            </span>
          </p>
        </div>
        <AddExpenseModal
          trigger={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          }
        />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
        <ExpenseList />
      </div>
    </div>
  );
}
