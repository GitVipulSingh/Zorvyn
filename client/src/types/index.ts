export type Category =
  | "Food & Dining"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Bills & Utilities"
  | "Other";

export type Intent = "Need" | "Want" | "Investment" | "Regret";

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  date: string;
  note: string;
  intent?: Intent;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  iconKey: string;
  description?: string;
}

export type Mood = "Good" | "Okay" | "Warning";

export interface UserPreferences {
  name: string;
  monthlyBudget: number;
  monthlyIncome?: number;
  currency: string;
}
