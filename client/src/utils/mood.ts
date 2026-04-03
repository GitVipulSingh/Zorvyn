import { Mood, Transaction } from "@/types";
import { MOOD_THRESHOLDS } from "@/constants";
import { startOfMonth } from "date-fns";

export function calculateMood(
  transactions: Transaction[],
  monthlyBudget: number
): Mood {
  const monthStart = startOfMonth(new Date());
  const monthlySpend = transactions
    .filter((t) => new Date(t.date) >= monthStart)
    .reduce((sum, t) => sum + t.amount, 0);

  const ratio = monthlyBudget > 0 ? monthlySpend / monthlyBudget : 0;

  if (ratio <= MOOD_THRESHOLDS.GOOD) return "Good";
  if (ratio <= MOOD_THRESHOLDS.OKAY) return "Okay";
  return "Warning";
}

export const moodConfig: Record<
  Mood,
  { label: string; sublabel: string; color: string; bg: string; border: string; ring: string }
> = {
  Good: {
    label: "On Track",
    sublabel: "Spending within budget",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    ring: "ring-emerald-500",
  },
  Okay: {
    label: "Watch Out",
    sublabel: "Approaching your limit",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    ring: "ring-amber-500",
  },
  Warning: {
    label: "Over Budget",
    sublabel: "You've exceeded your limit",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    ring: "ring-red-500",
  },
};
