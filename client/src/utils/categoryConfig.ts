import { Category } from "@/types";
import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Clapperboard,
  HeartPulse,
  Zap,
  Package,
  type LucideIcon,
} from "lucide-react";

export interface CategoryMeta {
  icon: LucideIcon;
  color: string;
  bg: string;
  text: string;
}

export const categoryConfig: Record<Category, CategoryMeta> = {
  "Food & Dining": {
    icon: UtensilsCrossed,
    color: "#ea580c",
    bg: "bg-orange-50",
    text: "text-orange-600",
  },
  Transport: {
    icon: Car,
    color: "#2563eb",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  Shopping: {
    icon: ShoppingBag,
    color: "#db2777",
    bg: "bg-pink-50",
    text: "text-pink-600",
  },
  Entertainment: {
    icon: Clapperboard,
    color: "#7c3aed",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
  Health: {
    icon: HeartPulse,
    color: "#059669",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  "Bills & Utilities": {
    icon: Zap,
    color: "#d97706",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  Other: {
    icon: Package,
    color: "#6b7280",
    bg: "bg-gray-50",
    text: "text-gray-600",
  },
};

export const CATEGORIES: Category[] = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Bills & Utilities",
  "Other",
];
