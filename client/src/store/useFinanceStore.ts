import { create } from "zustand";
import { Transaction, Goal, UserPreferences } from "@/types";
import { transactionService } from "@/services/transactionService";
import { goalService } from "@/services/goalService";
import { userService } from "@/services/userService";
import { generateId } from "@/utils/format";

interface FinanceStore {
  transactions: Transaction[];
  goals: Goal[];
  user: UserPreferences;

  // Transactions
  loadTransactions: () => void;
  addTransaction: (data: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Goals
  loadGoals: () => void;
  addGoal: (data: Omit<Goal, "id">) => void;
  updateGoal: (id: string, data: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // User
  loadUser: () => void;
  updateUser: (data: Partial<UserPreferences>) => void;
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  transactions: [],
  goals: [],
  user: userService.get(),

  loadTransactions: () => {
    set({ transactions: transactionService.getAll() });
  },

  addTransaction: (data) => {
    const tx: Transaction = { ...data, id: generateId() };
    const updated = transactionService.add(tx);
    set({ transactions: updated });
  },

  updateTransaction: (id, data) => {
    const updated = transactionService.update(id, data);
    set({ transactions: updated });
  },

  deleteTransaction: (id) => {
    const updated = transactionService.remove(id);
    set({ transactions: updated });
  },

  loadGoals: () => {
    set({ goals: goalService.getAll() });
  },

  addGoal: (data) => {
    const goal: Goal = { ...data, id: generateId() };
    const updated = goalService.add(goal);
    set({ goals: updated });
  },

  updateGoal: (id, data) => {
    const updated = goalService.update(id, data);
    set({ goals: updated });
  },

  deleteGoal: (id) => {
    const updated = goalService.remove(id);
    set({ goals: updated });
  },

  loadUser: () => {
    set({ user: userService.get() });
  },

  updateUser: (data) => {
    const current = userService.get();
    const updated = { ...current, ...data };
    userService.save(updated);
    set({ user: updated });
  },
}));
