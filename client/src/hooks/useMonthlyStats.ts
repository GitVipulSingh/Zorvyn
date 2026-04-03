import { useMemo } from "react";
import { Transaction, Category } from "@/types";
import { startOfMonth } from "date-fns";
import { TOP_CATEGORIES_LIMIT } from "@/constants";

export function useMonthlyStats(transactions: Transaction[]) {
  return useMemo(() => {
    const monthStart = startOfMonth(new Date());
    const monthlyTx = transactions.filter((t) => new Date(t.date) >= monthStart);
    const monthlyTotal = monthlyTx.reduce((sum, t) => sum + t.amount, 0);

    const categoryTotals = monthlyTx.reduce<Record<Category, number>>(
      (acc, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + t.amount;
        return acc;
      },
      {} as Record<Category, number>
    );

    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_CATEGORIES_LIMIT) as [Category, number][];

    return { monthlyTotal, topCategories, monthlyTx };
  }, [transactions]);
}
