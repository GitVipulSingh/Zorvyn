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
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    ring: "ring-[rgba(16,185,129,0.5)]",
  },
  Okay: {
    label: "Watch Out",
    sublabel: "Approaching your limit",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    ring: "ring-[rgba(245,158,11,0.5)]",
  },
  Warning: {
    label: "Over Budget",
    sublabel: "You've exceeded your limit",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    ring: "ring-[rgba(244,63,94,0.5)]",
  },
};
