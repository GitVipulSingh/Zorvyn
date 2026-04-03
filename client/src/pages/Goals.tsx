import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";

export function Goals() {
  const { goals, loadGoals, addGoal } = useFinanceStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [iconKey, setIconKey] = useState("home");

  useEffect(() => {
    loadGoals();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !target) return;
    addGoal({
      title,
      targetAmount: Number(target),
      savedAmount: Number(saved) || 0,
      iconKey,
    });
    setOpen(false);
    setTitle("");
    setTarget("");
    setSaved("");
    setIconKey("home");
  };

  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const completedGoals = goals.filter(
    (g) => g.savedAmount >= g.targetAmount
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track what you're saving for
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
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
                <div className="grid grid-cols-5 gap-2">
                  {GOAL_ICON_OPTIONS.map((key) => {
                    const Icon = getGoalIcon(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-label={key}
                        aria-pressed={iconKey === key}
                        onClick={() => setIconKey(key)}
                        className={cn(
                          "flex items-center justify-center h-10 rounded-xl border transition-all",
                          iconKey === key
                            ? "border-violet-500 bg-violet-50 text-violet-600"
                            : "border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600"
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="goal-title">Goal name</Label>
                <Input
                  id="goal-title"
                  placeholder="e.g. New laptop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="goal-target">Target amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <Input
                    id="goal-target"
                    type="number"
                    placeholder="1000"
                    className="pl-7"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <Input
                    id="goal-saved"
                    type="number"
                    placeholder="0"
                    className="pl-7"
                    value={saved}
                    onChange={(e) => setSaved(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

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
              value: `$${Math.round(totalSaved).toLocaleString()}`,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center"
            >
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 mb-4">
            <Target className="h-6 w-6 text-gray-400" />
          </div>
          <p className="font-semibold text-gray-700">No goals yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Set a savings goal and track your progress
          </p>
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
