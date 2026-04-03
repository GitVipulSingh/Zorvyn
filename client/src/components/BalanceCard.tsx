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
      className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              Monthly Budget
            </p>
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {formatCurrency(user.monthlyBudget, user.currency)}
            </p>
            <p className="text-violet-400 text-sm mt-1 sm:mt-2 font-medium">{monthName}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <DollarSign className="h-6 w-6 text-violet-400" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${spendPercent}%` }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
              className={`h-full rounded-full shadow-[0_0_15px_rgba(139,92,246,0.6)] ${isOver ? "bg-rose-500" : "bg-violet-500"}`}
            />
          </div>
          <div className="flex justify-between items-center mt-2.5">
            <p className="text-gray-400 text-xs tracking-wider">{Math.round(spendPercent)}% USED</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 px-4 py-3">
            <div className="flex items-center gap-2 text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1.5">
              <TrendingDown className="h-3.5 w-3.5 text-violet-400" />
              Spent
            </div>
            <p className="font-bold text-white text-base sm:text-lg tracking-wide">
              {formatCurrency(monthlyTotal, user.currency)}
            </p>
          </div>
          <div className={`rounded-2xl border px-4 py-3 ${isOver ? "bg-rose-500/10 border-rose-500/20" : "bg-gradient-to-br from-white/5 to-transparent border-white/5"}`}>
            <div className="flex items-center gap-2 text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1.5">
              <TrendingUp className={`h-3.5 w-3.5 ${isOver ? "text-rose-400" : "text-emerald-400"}`} />
              {isOver ? "Over by" : "Remaining"}
            </div>
            <p className={`font-bold text-base sm:text-lg tracking-wide ${isOver ? "text-rose-400" : "text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]"}`}>
              {formatCurrency(Math.abs(remaining), user.currency)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
