import { useMemo } from "react";
import { Transaction, UserPreferences } from "@/types";
import { startOfMonth } from "date-fns";

export interface WellnessData {
  score: number;
  message: string;
  breakdown: {
    need: number;
    want: number;
    investment: number;
    regret: number;
    untagged: number;
  };
}

export function useWellnessScore(transactions: Transaction[], user: UserPreferences): WellnessData {
  const monthStart = startOfMonth(new Date());

  const data = useMemo(() => {
    const currentMonthTxs = transactions.filter((t) => new Date(t.date) >= monthStart);

    const breakdown = {
      need: 0,
      want: 0,
      investment: 0,
      regret: 0,
      untagged: 0,
    };

    let totalSpent = 0;

    currentMonthTxs.forEach((tx) => {
      totalSpent += tx.amount;
      if (tx.intent === "Need") breakdown.need += tx.amount;
      else if (tx.intent === "Want") breakdown.want += tx.amount;
      else if (tx.intent === "Investment") breakdown.investment += tx.amount;
      else if (tx.intent === "Regret") breakdown.regret += tx.amount;
      else breakdown.untagged += tx.amount;
    });

    let score = 75; // Baseline score
    let message = "You're off to a balanced start.";

    if (totalSpent === 0) {
      return { score: 0, message: "Log an expense to see your wellness score.", breakdown };
    }

    const { monthlyBudget } = user;
    const investRatio = breakdown.investment / monthlyBudget;
    const regretRatio = breakdown.regret / totalSpent;
    const spendRatio = totalSpent / monthlyBudget;

    // Bonus for investments (up to +25 points)
    score += Math.min(investRatio * 150, 25);

    // Penalty for regrets (up to -30 points)
    score -= Math.min(regretRatio * 100, 30);

    // Penalty for blowing budget
    if (spendRatio > 1.0) {
      score -= 20;
    } else if (spendRatio < 0.8 && breakdown.investment > 0) {
      score += 10; // Frugal and investing
    }

    // Clamp between 0 and 100
    score = Math.max(0, Math.min(Math.round(score), 100));

    // Determine algorithmic insight message
    if (score >= 90) {
      message = "Incredible mindfulness! You're prioritizing growth.";
    } else if (score >= 75) {
      message = "Solid habits. Keep nurturing your financial health.";
    } else if (score >= 50) {
      message = "A bit scattered. Watch those impulse wants and regrets.";
    } else {
      message = "Rough month. Take a breather and reset your spending priorities.";
    }

    if (breakdown.untagged === totalSpent && totalSpent > 0) {
      message = "Tag your expenses with intents (Need/Want) to calculate your true pulse.";
      score = 50; // Neutral because no data
    }

    return { score, message, breakdown };
  }, [transactions, user]);

  return data;
}
