import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useInsights } from "@/hooks/useInsights";
import { InsightCard } from "@/components/InsightCard";
import { WellnessCard } from "@/components/WellnessCard";
import { useWellnessScore } from "@/hooks/useWellnessScore";
import { formatCurrency } from "@/utils/format";

export function Insights() {
  const { transactions, user } = useFinanceStore();
  const { chartData, insights } = useInsights(transactions, user);
  const wellnessData = useWellnessScore(transactions, user);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-wide">Insights</h1>
        <p className="text-sm text-gray-400 mt-1">Your spending story this month</p>
      </div>

      <WellnessCard data={wellnessData} />

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 border border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.02)] mb-5">
            <BarChart3 className="h-7 w-7 text-gray-500" />
          </div>
          <p className="font-semibold text-white tracking-wide">No data yet</p>
          <p className="text-sm text-gray-400 mt-1.5">
            Add some expenses to see your insights
          </p>
        </div>
      ) : (
        <>
          {/* Charts row */}
          {chartData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Donut chart */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5 shadow-sm backdrop-blur-md"
              >
                <p className="text-sm font-bold tracking-wide text-white mb-5">
                  Spending by Category
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((item, i) => (
                        <Cell key={i} fill={item.color} style={{ filter: `drop-shadow(0px 0px 8px ${item.color}80)` }} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) =>
                        formatCurrency(value, user.currency)
                      }
                      contentStyle={{
                        borderRadius: "16px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
                        fontSize: "13px",
                        backgroundColor: "rgba(20, 20, 30, 0.95)",
                        color: "white",
                        padding: "10px 14px",
                      }}
                      itemStyle={{ color: "white", fontWeight: 500 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 justify-center">
                  {chartData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 text-xs font-medium text-gray-300 tracking-wide"
                    >
                      <span
                        className="h-2 w-2 rounded-full flex-shrink-0 shadow-[0_0_5px_currentColor]"
                        style={{ backgroundColor: item.color, color: item.color }}
                      />
                      {item.name}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Bar chart */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5 shadow-sm backdrop-blur-md"
              >
                <p className="text-sm font-bold tracking-wide text-white mb-5">
                  Amount by Category
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 0, right: 0, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      tickFormatter={(v: string) => v.split(" ")[0]}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) => `$${v}`}
                    />
                    <Tooltip
                      formatter={(value: any) =>
                        formatCurrency(value, user.currency)
                      }
                      contentStyle={{
                        borderRadius: "16px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
                        fontSize: "13px",
                        backgroundColor: "rgba(20, 20, 30, 0.95)",
                        color: "white",
                        padding: "10px 14px",
                      }}
                      itemStyle={{ color: "white", fontWeight: 500 }}
                      cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((item, i) => (
                        <Cell key={i} fill={item.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          )}

          {/* Insight cards */}
          <div className="pt-2">
            <h2 className="text-sm font-bold tracking-wide text-white mb-4">Key Takeaways</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {insights.map((insight, i) => (
                <InsightCard key={i} {...insight} index={i} /> /* Re-import InsightCard since it was removed by top replacement */
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
