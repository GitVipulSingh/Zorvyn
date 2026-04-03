import { Goal } from "@/types";
import { STORAGE_KEYS } from "@/constants";

function isValidGoal(g: unknown): g is Goal {
  if (typeof g !== "object" || g === null) return false;
  const obj = g as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.targetAmount === "number" &&
    typeof obj.savedAmount === "number" &&
    typeof obj.iconKey === "string"
  );
}

export const goalService = {
  getAll(): Goal[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isValidGoal);
    } catch (e) {
      console.error("Failed to load goals:", e);
      return [];
    }
  },

  save(goals: Goal[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (e) {
      console.error("Failed to save goals — storage may be full:", e);
    }
  },

  add(current: Goal[], goal: Goal): Goal[] {
    const updated = [...current, goal];
    this.save(updated);
    return updated;
  },

  update(current: Goal[], id: string, data: Partial<Goal>): Goal[] {
    const updated = current.map((g) =>
      g.id === id ? { ...g, ...data } : g
    );
    this.save(updated);
    return updated;
  },

  remove(current: Goal[], id: string): Goal[] {
    const updated = current.filter((g) => g.id !== id);
    this.save(updated);
    return updated;
  },
};
