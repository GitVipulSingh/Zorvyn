import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, DollarSign } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useMonthlyStats } from "@/hooks/useMonthlyStats";
import { formatCurrency } from "@/utils/format";

export function BalanceCard() {
  const { transactions, user } = useFinanceStore();
  const { monthlyTotal } = useMonthlyStats(transactions);

  const remaining = user.monthlyBudget - monthlyTotal;
  const spendPercent =
    user.monthlyBudget > 0
      ? Math.min((monthlyTotal / user.monthlyBudget) * 100, 100)
      : 0;
  const isOver = remaining < 0;
  const monthName = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-700 p-6 text-white"
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
      <div className="absolute -right-4 -bottom-10 h-32 w-32 rounded-full bg-white/5" />

      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-violet-200 text-xs font-medium uppercase tracking-widest mb-1">
              Monthly Budget
            </p>
            <p className="text-3xl font-bold tracking-tight">
              {formatCurrency(user.monthlyBudget, user.currency)}
            </p>
            <p className="text-violet-300 text-sm mt-0.5">{monthName}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${spendPercent}%` }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
              className={`h-full rounded-full ${isOver ? "bg-red-400" : "bg-white"}`}
            />
          </div>
          <p className="text-violet-300 text-xs mt-1.5">{Math.round(spendPercent)}% used</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/10 px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-violet-200 text-xs mb-1">
              <TrendingDown className="h-3.5 w-3.5" />
              Spent
            </div>
            <p className="font-semibold text-sm">
              {formatCurrency(monthlyTotal, user.currency)}
            </p>
          </div>
          <div className={`rounded-xl px-3 py-2.5 ${isOver ? "bg-red-500/20" : "bg-white/10"}`}>
            <div className="flex items-center gap-1.5 text-violet-200 text-xs mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              {isOver ? "Over by" : "Remaining"}
            </div>
            <p className={`font-semibold text-sm ${isOver ? "text-red-300" : ""}`}>
              {formatCurrency(Math.abs(remaining), user.currency)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
