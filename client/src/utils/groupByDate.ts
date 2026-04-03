import { Transaction } from "@/types";
import { format, isToday, isYesterday } from "date-fns";

export function groupTransactionsByDate(
  transactions: Transaction[]
): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};
  [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .forEach((t) => {
      const key = t.date.slice(0, 10);
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
  return groups;
}

export function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMMM d, yyyy");
}
