import { useEffect } from "react";
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
import { MoodIndicator } from "@/components/MoodIndicator";
import { formatCurrency } from "@/utils/format";

export function Insights() {
  const { transactions, user, loadTransactions } = useFinanceStore();
  const { chartData, insights } = useInsights(transactions, user);

  useEffect(() => {
    loadTransactions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your spending story this month</p>
      </div>

      <MoodIndicator />

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 mb-4">
            <BarChart3 className="h-6 w-6 text-gray-400" />
          </div>
          <p className="font-semibold text-gray-700">No data yet</p>
          <p className="text-sm text-gray-400 mt-1">
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
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  Spending by Category
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={88}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((item, i) => (
                        <Cell key={i} fill={item.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        formatCurrency(value, user.currency)
                      }
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                  {chartData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-1.5 text-xs text-gray-600"
                    >
                      <span
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
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
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  Amount by Category
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f3f4f6"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      tickFormatter={(v: string) => v.split(" ")[0]}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) => `$${v}`}
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        formatCurrency(value, user.currency)
                      }
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                        fontSize: "12px",
                      }}
                      cursor={{ fill: "#f9fafb" }}
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
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Key Takeaways</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insights.map((insight, i) => (
                <InsightCard key={i} {...insight} index={i} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
