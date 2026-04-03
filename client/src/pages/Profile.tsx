import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Trash2, TrendingDown, Receipt, Target, PiggyBank } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatCurrency } from "@/utils/format";
import { STORAGE_KEYS } from "@/constants";

export function Profile() {
  const { user, updateUser, transactions, goals } = useFinanceStore();
  const [name, setName] = useState(user.name);
  const [budget, setBudget] = useState(user.monthlyBudget.toString());
  const [saved, setSaved] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: name.trim() || user.name,
      monthlyBudget: Number(budget),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  };

  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);
  const totalGoalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);

  const stats = [
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent, user.currency),
      icon: TrendingDown,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "Transactions",
      value: String(transactions.length),
      icon: Receipt,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Goals",
      value: String(goals.length),
      icon: Target,
      color: "text-violet-500",
      bg: "bg-violet-50",
    },
    {
      label: "Total Saved",
      value: formatCurrency(totalGoalSaved, user.currency),
      icon: PiggyBank,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your preferences</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl mb-3 ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} strokeWidth={2} />
            </div>
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Preferences form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="budget">Monthly budget</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                  $
                </span>
                <Input
                  id="budget"
                  type="number"
                  className="pl-7"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="0"
                  placeholder="3000"
                />
              </div>
              <p className="text-xs text-gray-400">
                Used to calculate your Money Mood and spending progress
              </p>
            </div>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="text-sm text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Permanently delete all your transactions, goals, and preferences.
            This cannot be undone.
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
