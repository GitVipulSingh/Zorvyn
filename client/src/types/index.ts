export type Category =
  | "Food & Dining"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Bills & Utilities"
  | "Other";

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  date: string;
  note: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  iconKey: string;
}

export type Mood = "Good" | "Okay" | "Warning";

export interface UserPreferences {
  name: string;
  monthlyBudget: number;
  currency: string;
}
