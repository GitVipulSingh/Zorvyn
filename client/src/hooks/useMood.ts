import { useMemo } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { calculateMood, moodConfig } from "@/utils/mood";
import { Mood } from "@/types";

export function useMood(): { mood: Mood; config: (typeof moodConfig)[Mood] } {
  const { transactions, user } = useFinanceStore();

  const mood = useMemo(
    () => calculateMood(transactions, user.monthlyBudget),
    [transactions, user.monthlyBudget]
  );

  return { mood, config: moodConfig[mood] };
}
