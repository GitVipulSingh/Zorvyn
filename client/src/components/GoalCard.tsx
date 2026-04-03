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
          "rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
          isComplete ? "border-emerald-200" : "border-gray-100"
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0",
                isComplete ? "bg-emerald-50" : "bg-violet-50"
              )}
            >
              {isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <Icon className="h-5 w-5 text-violet-600" strokeWidth={2} />
              )}
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">{goal.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatCurrency(goal.savedAmount, user.currency)}{" "}
                <span className="text-gray-400">of</span>{" "}
                {formatCurrency(goal.targetAmount, user.currency)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!isComplete && (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Add savings"
                onClick={() => setSavingsOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-gray-400 hover:text-red-500 hover:bg-red-50"
              aria-label="Delete goal"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Progress
            value={percent}
            className={isComplete ? "[&>div]:bg-emerald-500" : ""}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{Math.round(percent)}% complete</span>
            {isComplete ? (
              <span className="text-emerald-600 font-semibold">Goal reached!</span>
            ) : (
              <span>
                {formatCurrency(goal.targetAmount - goal.savedAmount, user.currency)} to go
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <AddSavingsModal
        open={savingsOpen}
        onOpenChange={setSavingsOpen}
        goalTitle={goal.title}
        onConfirm={(amount) =>
          updateGoal(goal.id, { savedAmount: goal.savedAmount + amount })
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
