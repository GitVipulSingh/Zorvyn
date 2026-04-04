import { motion } from "framer-motion";
import { UserPreferences, Transaction } from "@/types";
import { formatCurrency } from "@/utils/format";
import { AlertCircle } from "lucide-react";

interface BudgetRuleCardProps {
  user: UserPreferences;
  thisMonthTransactions: Transaction[];
}

export function BudgetRuleCard({ user, thisMonthTransactions }: BudgetRuleCardProps) {
  // If no income is set, we use a sensible fallback or hide
  const income = user.monthlyIncome || 0;

  if (income <= 0) {
    return (
      <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-5 shadow-sm backdrop-blur-md flex items-center gap-3">
        <div className="p-2 rounded-full bg-blue-500/10 text-blue-400">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-white tracking-wide">Set your Monthly Income</p>
          <p className="text-xs text-gray-400">Update your profile to see your 50/30/20 budget breakdown.</p>
        </div>
      </div>
    );
  }

  // Calculate based on intent
  const needsTotal = thisMonthTransactions
    .filter((t) => t.intent === "Need")
    .reduce((sum, t) => sum + t.amount, 0);

  const wantsTotal = thisMonthTransactions
    .filter((t) => t.intent === "Want" || t.intent === "Regret")
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsTotal = thisMonthTransactions
    .filter((t) => t.intent === "Investment")
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      label: "Needs (50%)",
      value: needsTotal,
      target: income * 0.5,
      color: "bg-blue-500",
      textColor: "text-blue-400",
      description: "Essentials like rent & groceries",
    },
    {
      label: "Wants (30%)",
      value: wantsTotal,
      target: income * 0.3,
      color: "bg-purple-500",
      textColor: "text-purple-400",
      description: "Dining out, hobbies, fun",
    },
    {
      label: "Savings (20%)",
      value: savingsTotal,
      target: income * 0.2,
      color: "bg-emerald-500",
      textColor: "text-emerald-400",
      description: "Investments & goals",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl border border-white/5 bg-white/[0.02] p-5 shadow-sm backdrop-blur-md"
    >
      <div className="mb-6">
        <h2 className="text-sm font-bold tracking-wide text-white">50/30/20 Rule</h2>
        <p className="text-xs text-gray-400 mt-1">A simple budgeting guide based on your new income.</p>
      </div>

      <div className="space-y-5">
        {stats.map((stat) => {
          const percentageUsed = Math.min((stat.value / stat.target) * 100, 100);
          const isOver = stat.value > stat.target && stat.label !== "Savings (20%)"; // It's fine to go over on savings!
          
          return (
            <div key={stat.label}>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-[13px] font-bold text-white tracking-wide">{stat.label}</p>
                  <p className="text-[10px] text-gray-500 tracking-wider hidden sm:block mt-0.5">{stat.description}</p>
                </div>
                <div className="text-right">
                  <p className={`text-[13px] font-bold ${isOver ? "text-rose-400" : stat.textColor}`}>
                    {formatCurrency(stat.value, user.currency)}
                  </p>
                  <p className="text-[10px] text-gray-500 tracking-wider mt-0.5">
                    Target: {formatCurrency(stat.target, user.currency)}
                  </p>
                </div>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentageUsed}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${isOver ? "bg-rose-500" : stat.color}`}
                  style={{ boxShadow: `0 0 10px ${isOver ? "rgba(244,63,94,0.5)" : "var(--tw-shadow-color)"}` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
