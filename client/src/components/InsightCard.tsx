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
  accent = "text-violet-600",
  index = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
    >
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 flex-shrink-0")}>
        <Icon className={cn("h-4.5 w-4.5", accent)} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm text-gray-900">{title}</p>
        <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
