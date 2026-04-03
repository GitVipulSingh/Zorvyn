import { UserPreferences } from "@/types";
import { STORAGE_KEYS, USER_DEFAULTS } from "@/constants";

export const userService = {
  get(): UserPreferences {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      return raw ? (JSON.parse(raw) as UserPreferences) : { ...USER_DEFAULTS };
    } catch {
      console.error("Failed to load user preferences");
      return { ...USER_DEFAULTS };
    }
  },

  save(prefs: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(prefs));
    } catch {
      console.error("Failed to save user preferences");
    }
  },
};
