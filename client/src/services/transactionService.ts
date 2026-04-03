import { Transaction } from "@/types";
import { STORAGE_KEYS } from "@/constants";

export const transactionService = {
  getAll(): Transaction[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return raw ? (JSON.parse(raw) as Transaction[]) : [];
    } catch {
      console.error("Failed to load transactions");
      return [];
    }
  },

  save(transactions: Transaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch {
      console.error("Failed to save transactions");
    }
  },

  add(transaction: Transaction): Transaction[] {
    const updated = [transaction, ...this.getAll()];
    this.save(updated);
    return updated;
  },

  update(id: string, data: Partial<Transaction>): Transaction[] {
    const updated = this.getAll().map((t) =>
      t.id === id ? { ...t, ...data } : t
    );
    this.save(updated);
    return updated;
  },

  remove(id: string): Transaction[] {
    const updated = this.getAll().filter((t) => t.id !== id);
    this.save(updated);
    return updated;
  },
};
