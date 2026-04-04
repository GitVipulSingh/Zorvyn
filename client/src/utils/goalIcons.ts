import {
  Home,
  Plane,
  Car,
  Laptop,
  Smartphone,
  GraduationCap,
  Heart,
  Dumbbell,
  Palmtree,
  PiggyBank,
  Target,
  MoreHorizontal,
  Camera,
  type LucideIcon,
} from "lucide-react";

export const goalIconMap: Record<string, LucideIcon> = {
  home: Home,
  plane: Plane,
  car: Car,
  laptop: Laptop,
  smartphone: Smartphone,
  "graduation-cap": GraduationCap,
  heart: Heart,
  dumbbell: Dumbbell,
  palmtree: Palmtree,
  "piggy-bank": PiggyBank,
  camera: Camera,
  other: MoreHorizontal,
};

export function getGoalIcon(key: string): LucideIcon {
  return goalIconMap[key] ?? Target;
}

export const GOAL_ICON_OPTIONS = Object.keys(goalIconMap);
