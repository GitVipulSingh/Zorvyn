import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, CheckCircle2 } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { formatCurrency } from "@/utils/format";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { AddSavingsModal } from "@/components/AddSavingsModal";
import { getGoalIcon } from "@/utils/goalIcons";
import { Goal } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  goal: Goal;
  index: number;
}

export function GoalCard({ goal, index }: Props) {
  const { deleteGoal, updateGoal, user } = useFinanceStore();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [savingsOpen, setSavingsOpen] = useState(false);

  const percent = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
  const isComplete = percent >= 100;
  const Icon = getGoalIcon(goal.iconKey);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.3 }}
        className={cn(
          "rounded-3xl glass-panel p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative overflow-hidden group",
          isComplete ? "border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]" : "border-white/5"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex items-start justify-between mb-5 relative z-10">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl flex-shrink-0 transition-colors duration-300",
                isComplete ? "bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              )}
            >
              {isComplete ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              ) : (
                <Icon className="h-6 w-6 text-blue-400" strokeWidth={2} />
              )}
            </div>
            <div>
              <p className="font-semibold text-base text-white tracking-wide">{goal.title}</p>
              {goal.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{goal.description}</p>}
              <p className="text-xs text-gray-400 mt-1">
                <span className="text-gray-200 font-medium">
                  {formatCurrency(goal.savedAmount, user.currency)}
                </span>
                <span className="text-gray-500 mx-1.5">/</span>
                {formatCurrency(goal.targetAmount, user.currency)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {!isComplete && (
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/10"
                aria-label="Add savings"
                onClick={() => setSavingsOpen(true)}
              >
                <Plus className="h-4 w-4 text-gray-300" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-rose-400 hover:bg-rose-500/10"
              aria-label="Delete goal"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <Progress
            value={percent}
            className={isComplete ? "[&>div]:bg-emerald-500 [&>div]:shadow-[0_0_12px_rgba(16,185,129,0.8)]" : ""}
          />
          <div className="flex justify-between items-center text-[10px] sm:text-xs">
            <span className="tracking-widest uppercase font-semibold text-gray-400">{Math.round(percent)}% COMPLETE</span>
            {isComplete ? (
              <span className="text-emerald-400 font-bold uppercase tracking-widest drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">Goal reached!</span>
            ) : (
              <span className="text-gray-500 tracking-wide">
                <span className="text-gray-300">{formatCurrency(goal.targetAmount - goal.savedAmount, user.currency)}</span> to go
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <AddSavingsModal
        open={savingsOpen}
        onOpenChange={setSavingsOpen}
        goalTitle={goal.title}
        maxAmount={goal.targetAmount - goal.savedAmount}
        onConfirm={(amount) =>
          updateGoal(goal.id, {
            savedAmount: Math.min(goal.savedAmount + amount, goal.targetAmount),
          })
        }
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete goal?"
        description={`"${goal.title}" will be permanently removed.`}
        onConfirm={() => deleteGoal(goal.id)}
      />
    </>
  );
}
