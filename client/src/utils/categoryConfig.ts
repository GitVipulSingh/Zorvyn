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
    color: "#f97316", // orange-500
    bg: "bg-orange-500/10",
    text: "text-orange-400",
  },
  Transport: {
    icon: Car,
    color: "#3b82f6", // blue-500
    bg: "bg-blue-500/10",
    text: "text-blue-400",
  },
  Shopping: {
    icon: ShoppingBag,
    color: "#ec4899", // pink-500
    bg: "bg-pink-500/10",
    text: "text-pink-400",
  },
  Entertainment: {
    icon: Clapperboard,
    color: "#a855f7", // purple-500
    bg: "bg-purple-500/10",
    text: "text-purple-400",
  },
  Health: {
    icon: HeartPulse,
    color: "#10b981", // emerald-500
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
  },
  "Bills & Utilities": {
    icon: Zap,
    color: "#eab308", // yellow-500
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
  },
  Other: {
    icon: Package,
    color: "#9ca3af", // gray-400
    bg: "bg-gray-500/10",
    text: "text-gray-400",
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
