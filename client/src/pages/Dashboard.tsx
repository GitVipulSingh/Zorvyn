import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useMonthlyStats } from "@/hooks/useMonthlyStats";
import { BalanceCard } from "@/components/BalanceCard";
import { MoodIndicator } from "@/components/MoodIndicator";
import { ExpenseList } from "@/components/ExpenseList";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { formatCurrency } from "@/utils/format";
import { categoryConfig } from "@/utils/categoryConfig";
import { RECENT_TRANSACTIONS_LIMIT } from "@/constants";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const { transactions, user, loadTransactions, loadGoals } = useFinanceStore();
  const { topCategories, monthlyTotal } = useMonthlyStats(transactions);

  useEffect(() => {
    loadTransactions();
    loadGoals();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good to see you, {user.name}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here's your financial overview
          </p>
        </div>
        <AddExpenseModal
          trigger={
            <Button className="gap-2 hidden sm:flex">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          }
        />
      </div>

      {/* Top grid: balance + mood */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BalanceCard />
        <div className="flex flex-col gap-4">
          <MoodIndicator />

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                Transactions
              </p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">all time</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                This Month
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(monthlyTotal, user.currency)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">total spent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      {topCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Top Categories</h2>
            <Link
              to="/insights"
              className="flex items-center gap-1 text-xs text-violet-600 font-medium hover:text-violet-700"
            >
              View insights <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topCategories.map(([cat, total]) => {
              const { icon: Icon, bg, text } = categoryConfig[cat];
              return (
                <div
                  key={cat}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl mb-3 ${bg}`}>
                    <Icon className={`h-4.5 w-4.5 ${text}`} strokeWidth={2} />
                  </div>
                  <p className="text-xs text-gray-500 truncate">{cat}</p>
                  <p className="font-semibold text-sm text-gray-900 mt-0.5">
                    {formatCurrency(total, user.currency)}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Recent transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Recent Transactions</h2>
          <Link
            to="/activity"
            className="flex items-center gap-1 text-xs text-violet-600 font-medium hover:text-violet-700"
          >
            See all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <ExpenseList limit={RECENT_TRANSACTIONS_LIMIT} />
      </div>

      {/* Mobile FAB */}
      <div className="fixed bottom-20 right-4 z-30 sm:hidden">
        <AddExpenseModal
          trigger={
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-200 hover:bg-violet-700 transition-colors">
              <Plus className="h-6 w-6" />
            </button>
          }
        />
      </div>
    </div>
  );
}
