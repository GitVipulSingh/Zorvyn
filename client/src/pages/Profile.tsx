import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Trash2, TrendingDown, Receipt, Target, PiggyBank, User, DollarSign, ShieldAlert } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatCurrency, getCurrencySymbol } from "@/utils/format";

const MAX_NAME_LENGTH = 40;

export function Profile() {
  const { user, updateUser, transactions, goals, reset } = useFinanceStore();
  const symbol = getCurrencySymbol(user.currency);

  const [name, setName] = useState(user.name);
  const [income, setIncome] = useState(user.monthlyIncome?.toString() || "");
  const [budget, setBudget] = useState(user.monthlyBudget.toString());
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [clearOpen, setClearOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBudget = Number(budget);
    if (!budget || isNaN(parsedBudget) || parsedBudget <= 0) {
      setFormError("Monthly budget must be greater than 0");
      return;
    }
    const parsedIncome = Number(income);
    const validIncome = income && !isNaN(parsedIncome) && parsedIncome > 0 ? parsedIncome : undefined;
    const trimmedName = name.trim().slice(0, MAX_NAME_LENGTH);
    updateUser({ name: trimmedName || user.name, monthlyBudget: parsedBudget, monthlyIncome: validIncome });
    setFormError(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    reset();
    setName("");
    setIncome("");
    setBudget("3000");
  };

  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);
  const totalGoalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);

  const stats = [
    { label: "Total Spent", value: formatCurrency(totalSpent, user.currency), icon: TrendingDown, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { label: "Transactions", value: String(transactions.length), icon: Receipt, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Goals", value: String(goals.length), icon: Target, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Total Saved", value: formatCurrency(totalGoalSaved, user.currency), icon: PiggyBank, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your preferences</p>
      </div>

      {/* Stats row — full width */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-5"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl mb-3 border ${stat.bg} ${stat.border}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} strokeWidth={2} />
            </div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* 2-column grid: form left, info right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Left: Preferences Form */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
              <User className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Preferences</h2>
              <p className="text-[11px] text-gray-500">Personalize your experience</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => { setName(e.target.value); setFormError(null); }}
                placeholder="What should we call you?"
                maxLength={MAX_NAME_LENGTH}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="income">Monthly Income (Take-home)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{symbol}</span>
                <Input
                  id="income"
                  type="number"
                  className="pl-7"
                  value={income}
                  onChange={(e) => { setIncome(e.target.value); setFormError(null); }}
                  min="0"
                  placeholder="e.g. 4500"
                />
              </div>
              <p className="text-[11px] text-gray-500">Used to power your 50/30/20 budget guide</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="budget">Monthly spending budget</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{symbol}</span>
                <Input
                  id="budget"
                  type="number"
                  className="pl-7"
                  value={budget}
                  onChange={(e) => { setBudget(e.target.value); setFormError(null); }}
                  min="1"
                  placeholder="3000"
                />
              </div>
              <p className="text-[11px] text-gray-500">Used to calculate your Money Mood</p>
            </div>

            {formError && (
              <p className="text-xs text-rose-500 font-medium">{formError}</p>
            )}

            <Button type="submit" className="gap-2 w-full">
              <Save className="h-4 w-4" />
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </form>
        </motion.div>

        {/* Right: Info + Danger Zone */}
        <div className="space-y-6">
          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">How It Works</h2>
                <p className="text-[11px] text-gray-500">Your data stays private</p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                { title: "Income", desc: "Your take-home pay is used to calculate your 50/30/20 budget breakdown on Insights." },
                { title: "Monthly Budget", desc: "Your spending cap. When you approach it, your Money Mood turns from ✅ to ⚠️." },
                { title: "Privacy", desc: "All your data is stored locally in your browser — nothing is ever sent to a server." },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-[12px] font-semibold text-white">{item.title}</p>
                    <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-rose-400 tracking-wide">Danger Zone</h2>
                <p className="text-[11px] text-gray-500">Irreversible actions</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Permanently delete all your transactions, goals, and preferences.
              <strong className="text-rose-400 font-medium block mt-1">This cannot be undone.</strong>
            </p>
            <Button variant="destructive" size="sm" className="gap-2" onClick={() => setClearOpen(true)}>
              <Trash2 className="h-3.5 w-3.5" />
              Clear All Data
            </Button>
          </motion.div>
        </div>
      </div>

      <ConfirmDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        title="Clear all data?"
        description="This will permanently delete all your transactions, goals, and preferences. This cannot be undone."
        confirmLabel="Clear Everything"
        onConfirm={handleClearData}
      />
    </div>
  );
}
