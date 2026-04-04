import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { WellnessData } from "@/hooks/useWellnessScore";
import { formatCurrency } from "@/utils/format";
import { useFinanceStore } from "@/store/useFinanceStore";

interface Props {
  data: WellnessData;
}

export function WellnessCard({ data }: Props) {
  const { user } = useFinanceStore();
  
  // Dynamic glow depending on score
  let accentColor = "rgba(16, 185, 129, 0.8)"; // Emerald
  let strokeColor = "#34d399";
  
  if (data.score < 50) {
    accentColor = "rgba(244, 63, 94, 0.8)"; // Rose
    strokeColor = "#fb7185";
  } else if (data.score < 75) {
    accentColor = "rgba(59, 130, 246, 0.8)"; // Violet
    strokeColor = "#a78bfa";
  }

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data.score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        
        {/* Radial Progress */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="10"
              fill="transparent"
            />
            {data.score > 0 && (
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke={strokeColor}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{ filter: `drop-shadow(0 0 8px ${accentColor})` }}
              />
            )}
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
              {data.score}
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
              Pulse
            </span>
          </div>
        </div>

        {/* Text Breakdown */}
        <div className="flex-1 text-center md:text-left min-w-0">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <Activity className="h-4 w-4 text-blue-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Financial Wellness Score
            </h2>
          </div>
          <p className="text-[11px] text-gray-500 mb-2">
            A score (0-100) based on your budget, rewarding Growth and penalizing Regrets.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed mb-5 border-l-2 border-blue-500/50 pl-2">
            {data.message}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 min-w-0">
              <p className="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest mb-1 truncate">Needs</p>
              <p className="text-sm font-bold text-blue-100 truncate">{formatCurrency(data.breakdown.need, user.currency)}</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 min-w-0">
              <p className="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest mb-1 truncate">Wants</p>
              <p className="text-sm font-bold text-blue-100 truncate">{formatCurrency(data.breakdown.want, user.currency)}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 min-w-0">
              <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest mb-1 truncate">Growth</p>
              <p className="text-sm font-bold text-emerald-100 truncate">{formatCurrency(data.breakdown.investment, user.currency)}</p>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 min-w-0">
              <p className="text-[10px] font-bold text-rose-400/80 uppercase tracking-widest mb-1 truncate">Regrets</p>
              <p className="text-sm font-bold text-rose-100 truncate">{formatCurrency(data.breakdown.regret, user.currency)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dynamic Background Glow Based on Score */}
      <div 
        className="absolute top-1/2 left-12 w-32 h-32 rounded-full opacity-20 blur-3xl -translate-y-1/2 pointer-events-none"
        style={{ backgroundColor: strokeColor }}
      />
    </motion.div>
  );
}
