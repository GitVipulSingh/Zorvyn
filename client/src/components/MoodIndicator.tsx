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
        "flex items-center gap-4 rounded-xl border p-4 shadow-sm backdrop-blur-md",
        config.bg,
        config.border
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-2xl flex-shrink-0 bg-black/20",
          "border border-white/5"
        )}
      >
        <Icon className={cn("h-5 w-5", config.color)} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
          Money Mood
        </p>
        <p className={cn("font-bold text-base tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]", config.color)}>
          {config.label}
        </p>
        <p className="text-xs text-gray-400 mt-1">{config.sublabel}</p>
      </div>
      <span
        className={cn(
          "rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex-shrink-0",
          config.bg,
          config.color,
          "border border-white/5"
        )}
      >
        {mood}
      </span>
    </motion.div>
  );
}
