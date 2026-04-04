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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">Activity</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5 truncate">
            {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} &middot; This month:{" "}
            <span className="font-semibold text-white">
              {formatCurrency(monthlyTotal, user.currency)}
            </span>
          </p>
        </div>
        <AddExpenseModal
          trigger={
            <Button className="gap-2 hidden sm:flex shrink-0">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          }
        />
      </div>

      <div className="rounded-3xl border border-white/5 bg-white/[0.02] shadow-sm p-4 sm:p-5 backdrop-blur-md">
        <ExpenseList />
      </div>

      {/* Mobile FAB */}
      <div className="fixed bottom-20 right-4 z-30 sm:hidden">
        <AddExpenseModal
          trigger={
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:bg-blue-500 transition-all">
              <Plus className="h-6 w-6" />
            </button>
          }
        />
      </div>
    </div>
  );
}
