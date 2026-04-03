import { Plus } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useMonthlyStats } from "@/hooks/useMonthlyStats";
import { ExpenseList } from "@/components/ExpenseList";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";

export function Activity() {
  const { transactions, user } = useFinanceStore();
  const { monthlyTotal } = useMonthlyStats(transactions);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Activity</h1>
          <p className="text-sm text-gray-400 mt-1">
            {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} &middot; This month:{" "}
            <span className="font-semibold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">
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

      <div className="rounded-3xl border border-white/5 bg-white/[0.02] shadow-sm p-5 sm:p-6 backdrop-blur-md">
        <ExpenseList />
      </div>
    </div>
  );
}
