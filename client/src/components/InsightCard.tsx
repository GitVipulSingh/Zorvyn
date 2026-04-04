import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: string;
  index?: number;
}

export function InsightCard({
  icon: Icon,
  title,
  description,
  accent = "text-blue-600",
  index = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors"
    >
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 flex-shrink-0")}>
        <Icon className={cn("h-5 w-5", accent)} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm text-white tracking-wide">{title}</p>
        <p className="text-sm text-gray-400 mt-1 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
