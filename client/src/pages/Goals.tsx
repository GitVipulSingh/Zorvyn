import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Target } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { GoalCard } from "@/components/GoalCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getGoalIcon, GOAL_ICON_OPTIONS } from "@/utils/goalIcons";
import { formatCurrency, getCurrencySymbol } from "@/utils/format";
import { cn } from "@/lib/utils";

const MAX_GOAL_TITLE_LENGTH = 60;

export function Goals() {
  const { goals, addGoal, user } = useFinanceStore();
  const symbol = getCurrencySymbol(user.currency);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [iconKey, setIconKey] = useState("home");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const formatIconName = (k: string) => k.charAt(0).toUpperCase() + k.slice(1).replace('-', ' ');

  const handleQuickStart = () => {
    setIconKey("piggy-bank");
    const assumedIncome = user.monthlyIncome || user.monthlyBudget || 3000;
    setTarget((assumedIncome * 3).toString());
    setDescription("3 months of living expenses");
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTitle = iconKey === 'other' ? title.trim() : formatIconName(iconKey);
    const trimmedTitle = finalTitle.slice(0, MAX_GOAL_TITLE_LENGTH);
    if (!trimmedTitle) {
      setFormError("Please enter a goal name");
      return;
    }

    const parsedTarget = Number(target);
    if (!target || isNaN(parsedTarget) || parsedTarget <= 0) {
      setFormError("Target amount must be greater than 0");
      return;
    }

    const parsedSaved = Number(saved) || 0;
    if (parsedSaved < 0) {
      setFormError("Saved amount cannot be negative");
      return;
    }

    addGoal({
      title: trimmedTitle,
      targetAmount: parsedTarget,
      savedAmount: Math.min(parsedSaved, parsedTarget),
      iconKey,
      description: description.trim() || undefined,
    });
    setOpen(false);
    setTitle("");
    setTarget("");
    setSaved("");
    setDescription("");
    setIconKey("home");
    setFormError(null);
  };

  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const completedGoals = goals.filter(
    (g) => g.savedAmount >= g.targetAmount
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Goals</h1>
          <p className="text-sm text-gray-400 mt-1">
            Track what you're saving for
          </p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setFormError(null); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a Goal</DialogTitle>
            </DialogHeader>
            <motion.form
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Icon picker */}
              <div className="space-y-1.5">
                <Label>Icon</Label>
                <div className="grid grid-cols-6 gap-2">
                  {GOAL_ICON_OPTIONS.map((key) => {
                    const Icon = getGoalIcon(key);
                    return (
                      <div key={key} className="relative group flex flex-col items-center">
                        <button
                          type="button"
                          aria-label={key}
                          aria-pressed={iconKey === key}
                          onClick={() => setIconKey(key)}
                          className={cn(
                            "flex w-full items-center justify-center h-10 rounded-xl border transition-all duration-300",
                            iconKey === key
                              ? "border-blue-500 bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                              : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                          )}
                        >
                          <Icon className="h-5 w-5" strokeWidth={2} />
                        </button>
                        <div className="absolute -top-8 px-2 py-1 bg-gray-900 border border-white/10 text-white text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                          {formatIconName(key)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {iconKey === 'other' && (
                <div className="space-y-1.5">
                  <Label htmlFor="goal-title">Goal name</Label>
                  <Input
                    id="goal-title"
                    placeholder="e.g. New laptop"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setFormError(null); }}
                    maxLength={MAX_GOAL_TITLE_LENGTH}
                    required
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="goal-desc">Description <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
                <Input
                  id="goal-desc"
                  placeholder="e.g. For my next vacation"
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setFormError(null); }}
                  maxLength={100}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="goal-target">Target amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">{symbol}</span>
                  <Input
                    id="goal-target"
                    type="number"
                    placeholder="1000"
                    className="pl-7"
                    value={target}
                    onChange={(e) => { setTarget(e.target.value); setFormError(null); }}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="goal-saved">
                  Already saved{" "}
                  <span className="text-gray-400 font-normal text-xs">(optional)</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">{symbol}</span>
                  <Input
                    id="goal-saved"
                    type="number"
                    placeholder="0"
                    className="pl-7"
                    value={saved}
                    onChange={(e) => { setSaved(e.target.value); setFormError(null); }}
                    min="0"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-xs text-red-500">{formError}</p>
              )}

              <Button type="submit" className="w-full" size="lg">
                Create Goal
              </Button>
            </motion.form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary stats */}
      {goals.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Active Goals", value: String(goals.length) },
            { label: "Completed", value: String(completedGoals) },
            {
              label: "Total Saved",
              value: formatCurrency(totalSaved, user.currency),
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-4 shadow-sm text-center"
            >
              <p className="text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">{s.value}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center mt-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 border border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.02)] mb-5">
            <Target className="h-7 w-7 text-gray-500" />
          </div>
          <p className="font-semibold text-white tracking-wide text-lg">No goals yet</p>
          <p className="text-sm text-gray-400 mt-1.5 mb-8 max-w-sm mx-auto leading-relaxed">
            Set a savings goal and track your progress to build strong financial habits.
          </p>
          
          <Button 
            onClick={handleQuickStart}
            className="bg-emerald-600 hover:bg-emerald-500 hover:text-white text-white/90 shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:shadow-[0_0_30px_rgba(52,211,153,0.3)] transition-all border border-emerald-500/20"
          >
             Quick Start: Emergency Fund
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {goals.map((goal, i) => (
            <GoalCard key={goal.id} goal={goal} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
