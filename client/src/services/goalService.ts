import { Goal } from "@/types";
import { STORAGE_KEYS } from "@/constants";

export const goalService = {
  getAll(): Goal[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
      return raw ? (JSON.parse(raw) as Goal[]) : [];
    } catch {
      console.error("Failed to load goals");
      return [];
    }
  },

  save(goals: Goal[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch {
      console.error("Failed to save goals");
    }
  },

  add(goal: Goal): Goal[] {
    const updated = [...this.getAll(), goal];
    this.save(updated);
    return updated;
  },

  update(id: string, data: Partial<Goal>): Goal[] {
    const updated = this.getAll().map((g) =>
      g.id === id ? { ...g, ...data } : g
    );
    this.save(updated);
    return updated;
  },

  remove(id: string): Goal[] {
    const updated = this.getAll().filter((g) => g.id !== id);
    this.save(updated);
    return updated;
  },
};
