export const STORAGE_KEYS = {
  TRANSACTIONS: "finance_transactions",
  GOALS: "finance_goals",
  USER: "finance_user",
} as const;

export const MOOD_THRESHOLDS = {
  GOOD: 0.75,
  OKAY: 1.0,
} as const;

export const RECENT_TRANSACTIONS_LIMIT = 8;
export const TOP_CATEGORIES_LIMIT = 4;

export const CHART_COLORS = [
  "#7c3aed",
  "#2563eb",
  "#db2777",
  "#d97706",
  "#059669",
  "#6b7280",
  "#0891b2",
] as const;

// Goal icon keys (mapped to Lucide icons in categoryConfig)
export const GOAL_ICON_KEYS = [
  "home", "plane", "car", "laptop", "smartphone",
  "graduation-cap", "heart", "dumbbell", "palmtree", "piggy-bank",
] as const;

export const USER_DEFAULTS = {
  name: "Friend",
  monthlyBudget: 3000,
  currency: "USD",
} as const;
