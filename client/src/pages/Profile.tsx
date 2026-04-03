import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Trash2, TrendingDown, Receipt, Target, PiggyBank } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatCurrency, getCurrencySymbol } from "@/utils/format";

const MAX_NAME_LENGTH = 40;

export function Profile() {
  const { user, updateUser, transactions, goals, reset } = useFinanceStore();
  const symbol = getCurrencySymbol(user.currency);

  const [name, setName] = useState(user.name);
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

    const trimmedName = name.trim().slice(0, MAX_NAME_LENGTH);

    updateUser({
      name: trimmedName || user.name,
      monthlyBudget: parsedBudget,
    });
    setFormError(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    reset();
    setName("");
    setBudget("3000"); // A reasonable default since context is reset
  };

  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);
  const totalGoalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);

  const stats = [
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent, user.currency),
      icon: TrendingDown,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20"
    },
    {
      label: "Transactions",
      value: String(transactions.length),
      icon: Receipt,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      label: "Goals",
      value: String(goals.length),
      icon: Target,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20"
    },
    {
      label: "Total Saved",
      value: formatCurrency(totalGoalSaved, user.currency),
      icon: PiggyBank,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-wide">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your preferences</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className="rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-5 shadow-sm"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-4 border ${stat.bg} ${stat.border}`}>
              <stat.icon className={`h-5 w-5 ${stat.color} drop-shadow-[0_0_8px_currentColor]`} strokeWidth={2} />
            </div>
            <p className="text-xl font-bold text-white tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">{stat.value}</p>
            <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-1.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Preferences form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-white tracking-wide">Preferences</CardTitle>
        </CardHeader>
        <CardContent>
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
              <Label htmlFor="budget">Monthly budget</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                  {symbol}
                </span>
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
              <p className="text-[11px] text-gray-500 font-medium tracking-wide">
                Used to calculate your Money Mood and spending progress
              </p>
            </div>
            {formError && (
              <p className="text-xs text-rose-500 font-medium drop-shadow-[0_0_5px_rgba(244,63,94,0.3)]">{formError}</p>
            )}
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-rose-500/20 bg-rose-500/5 shadow-[0_0_20px_rgba(244,63,94,0.05)]">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-rose-400 tracking-wide drop-shadow-[0_0_5px_rgba(244,63,94,0.3)]">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 mb-5 leading-relaxed tracking-wide">
            Permanently delete all your transactions, goals, and preferences.
            <strong className="text-rose-400/90 font-medium block mt-1">This cannot be undone.</strong>
          </p>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => setClearOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>

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
