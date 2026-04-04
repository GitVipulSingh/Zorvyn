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
  const { transactions, user } = useFinanceStore();
  const { topCategories, monthlyTotal } = useMonthlyStats(transactions);

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Good to see you, <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">{user.name}</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Transactions
              </p>
              <p className="text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">{transactions.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">All time</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                This Month
              </p>
              <p className="text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                {formatCurrency(monthlyTotal, user.currency)}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">Total spent</p>
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold tracking-wide text-white">Top Categories</h2>
            <Link
              to="/insights"
              className="flex items-center gap-1 text-xs text-blue-400 font-medium hover:text-blue-300 transition-colors"
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
                  className="rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all p-4 shadow-sm"
                >
                  <div className={`flex h-10 w-10 items-center justify-center border border-white/5 rounded-xl mb-3 ${bg}`}>
                    <Icon className={`h-5 w-5 ${text}`} strokeWidth={2} />
                  </div>
                  <p className="text-xs text-gray-400 font-medium truncate tracking-wide">{cat}</p>
                  <p className="font-bold text-sm text-white mt-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold tracking-wide text-white">Recent Transactions</h2>
          <Link
            to="/activity"
            className="flex items-center gap-1 text-xs text-blue-400 font-medium hover:text-blue-300 transition-colors"
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
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all">
              <Plus className="h-6 w-6" />
            </button>
          }
        />
      </div>
    </div>
  );
}
