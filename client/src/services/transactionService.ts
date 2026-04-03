import { Transaction } from "@/types";
import { STORAGE_KEYS } from "@/constants";
import { CATEGORIES } from "@/utils/categoryConfig";

function isValidTransaction(t: unknown): t is Transaction {
  if (typeof t !== "object" || t === null) return false;
  const obj = t as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.amount === "number" &&
    typeof obj.category === "string" &&
    typeof obj.date === "string" &&
    typeof obj.note === "string" &&
    CATEGORIES.includes(obj.category as Transaction["category"])
  );
}

export const transactionService = {
  getAll(): Transaction[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isValidTransaction);
    } catch (e) {
      console.error("Failed to load transactions:", e);
      return [];
    }
  },

  save(transactions: Transaction[]): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.TRANSACTIONS,
        JSON.stringify(transactions)
      );
    } catch (e) {
      console.error("Failed to save transactions — storage may be full:", e);
    }
  },

  add(current: Transaction[], transaction: Transaction): Transaction[] {
    const updated = [transaction, ...current];
    this.save(updated);
    return updated;
  },

  update(
    current: Transaction[],
    id: string,
    data: Partial<Transaction>
  ): Transaction[] {
    const updated = current.map((t) =>
      t.id === id ? { ...t, ...data } : t
    );
    this.save(updated);
    return updated;
  },

  remove(current: Transaction[], id: string): Transaction[] {
    const updated = current.filter((t) => t.id !== id);
    this.save(updated);
    return updated;
  },
};
