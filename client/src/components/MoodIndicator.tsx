import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useMood } from "@/hooks/useMood";
import { cn } from "@/lib/utils";

const moodIcons = {
  Good: CheckCircle2,
  Okay: TrendingUp,
  Warning: AlertTriangle,
};

export function MoodIndicator() {
  const { mood, config } = useMood();
  const Icon = moodIcons[mood];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      role="status"
      aria-label={`Money Mood: ${mood}. ${config.label}`}
      className={cn(
        "flex items-center gap-4 rounded-2xl border p-4",
        config.bg,
        config.border
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0",
          config.bg,
          "border",
          config.border
        )}
      >
        <Icon className={cn("h-5 w-5", config.color)} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Money Mood
        </p>
        <p className={cn("font-semibold text-sm mt-0.5", config.color)}>
          {config.label}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{config.sublabel}</p>
      </div>
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-semibold flex-shrink-0",
          config.bg,
          config.color,
          "border",
          config.border
        )}
      >
        {mood}
      </span>
    </motion.div>
  );
}
