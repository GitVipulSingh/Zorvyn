import { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  Gauge,
  type LucideIcon,
} from "lucide-react";
import { Transaction, Category, UserPreferences } from "@/types";
import { categoryConfig } from "@/utils/categoryConfig";
import { formatCurrency } from "@/utils/format";
import { CHART_COLORS } from "@/constants";
import { startOfMonth, subMonths, format } from "date-fns";

export interface InsightItem {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}

export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export function useInsights(transactions: Transaction[], user: UserPreferences) {
  return useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));

    const thisMonth = transactions.filter((t) => new Date(t.date) >= monthStart);
    const lastMonth = transactions.filter(
      (t) =>
        new Date(t.date) >= lastMonthStart && new Date(t.date) < monthStart
    );

    const thisTotal = thisMonth.reduce((s, t) => s + t.amount, 0);
    const lastTotal = lastMonth.reduce((s, t) => s + t.amount, 0);

    const categoryTotals = thisMonth.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount;
      return acc;
    }, {});

    const chartData: ChartDataItem[] = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({
        name,
        value,
        color: CHART_COLORS[i % CHART_COLORS.length],
      }));

    const insights: InsightItem[] = [];

    if (thisTotal > 0 && lastTotal > 0) {
      const diff = thisTotal - lastTotal;
      const pct = Math.abs(Math.round((diff / lastTotal) * 100));
      insights.push({
        icon: diff > 0 ? TrendingUp : TrendingDown,
        title:
          diff > 0
            ? `Spending up ${pct}% vs last month`
            : `Spending down ${pct}% vs last month`,
        description:
          diff > 0
            ? `You spent ${formatCurrency(diff, user.currency)} more than ${format(lastMonthStart, "MMMM")}. Try to cut back a little.`
            : `You saved ${formatCurrency(Math.abs(diff), user.currency)} compared to last month. Keep it up.`,
        accent: diff > 0 ? "text-red-500" : "text-emerald-600",
      });
    }

    if (chartData.length > 0 && thisTotal > 0) {
      const top = chartData[0];
      const pct = Math.round((top.value / thisTotal) * 100);
      const catIcon = categoryConfig[top.name as Category]?.icon ?? PieChart;
      insights.push({
        icon: catIcon,
        title: `${top.name} is your top category`,
        description: `${pct}% of your spending this month — ${formatCurrency(top.value, user.currency)} total.`,
        accent: "text-blue-600",
      });
    }

    if (thisMonth.length > 0) {
      const dayOfMonth = now.getDate();
      const avgPerDay = thisTotal / dayOfMonth;
      insights.push({
        icon: Calendar,
        title: `~${formatCurrency(avgPerDay, user.currency)} per day`,
        description: `Based on ${thisMonth.length} transaction${thisMonth.length !== 1 ? "s" : ""} this month.`,
        accent: "text-blue-600",
      });
    }

    if (user.monthlyBudget > 0 && thisTotal > 0) {
      const remaining = user.monthlyBudget - thisTotal;
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();
      const daysLeft = daysInMonth - now.getDate();
      if (remaining > 0 && daysLeft > 0) {
        insights.push({
          icon: Gauge,
          title: `${formatCurrency(remaining / daysLeft, user.currency)}/day remaining`,
          description: `${formatCurrency(remaining, user.currency)} left for ${daysLeft} more days this month.`,
          accent: "text-amber-600",
        });
      }
    }

    return { chartData, insights, thisTotal, lastTotal, thisMonth, lastMonth };
  }, [transactions, user]);
}
