import { UserPreferences } from "@/types";
import { STORAGE_KEYS, USER_DEFAULTS } from "@/constants";

function isValidUserPreferences(u: unknown): u is UserPreferences {
  if (typeof u !== "object" || u === null) return false;
  const obj = u as Record<string, unknown>;
  return (
    typeof obj.name === "string" &&
    typeof obj.monthlyBudget === "number" &&
    typeof obj.currency === "string"
  );
}

export const userService = {
  get(): UserPreferences {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      if (!raw) return { ...USER_DEFAULTS };
      const parsed = JSON.parse(raw);
      if (!isValidUserPreferences(parsed)) return { ...USER_DEFAULTS };
      return parsed;
    } catch (e) {
      console.error("Failed to load user preferences:", e);
      return { ...USER_DEFAULTS };
    }
  },

  save(prefs: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(prefs));
    } catch (e) {
      console.error("Failed to save user preferences:", e);
    }
  },
};
