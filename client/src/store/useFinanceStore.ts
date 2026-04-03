import { create } from "zustand";
import { Transaction, Goal, UserPreferences } from "@/types";
import { transactionService } from "@/services/transactionService";
import { goalService } from "@/services/goalService";
import { userService } from "@/services/userService";
import { generateId } from "@/utils/format";
import { STORAGE_KEYS, USER_DEFAULTS } from "@/constants";

interface FinanceStore {
  transactions: Transaction[];
  goals: Goal[];
  user: UserPreferences;

  // Initialization (call once from Layout)
  initialize: () => void;

  // Transactions
  addTransaction: (data: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Goals
  addGoal: (data: Omit<Goal, "id">) => void;
  updateGoal: (id: string, data: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // User
  updateUser: (data: Partial<UserPreferences>) => void;

  // Reset everything
  reset: () => void;
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  transactions: [],
  goals: [],
  user: { ...USER_DEFAULTS },

  initialize: () => {
    set({
      transactions: transactionService.getAll(),
      goals: goalService.getAll(),
      user: userService.get(),
    });
  },

  addTransaction: (data) => {
    const tx: Transaction = { ...data, id: generateId() };
    const updated = transactionService.add(get().transactions, tx);
    set({ transactions: updated });
  },

  updateTransaction: (id, data) => {
    const updated = transactionService.update(get().transactions, id, data);
    set({ transactions: updated });
  },

  deleteTransaction: (id) => {
    const updated = transactionService.remove(get().transactions, id);
    set({ transactions: updated });
  },

  addGoal: (data) => {
    const goal: Goal = { ...data, id: generateId() };
    const updated = goalService.add(get().goals, goal);
    set({ goals: updated });
  },

  updateGoal: (id, data) => {
    const updated = goalService.update(get().goals, id, data);
    set({ goals: updated });
  },

  deleteGoal: (id) => {
    const updated = goalService.remove(get().goals, id);
    set({ goals: updated });
  },

  updateUser: (data) => {
    const current = get().user;
    const updated = { ...current, ...data };
    userService.save(updated);
    set({ user: updated });
  },

  reset: () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    set({
      transactions: [],
      goals: [],
      user: { ...USER_DEFAULTS },
    });
  },
}));
