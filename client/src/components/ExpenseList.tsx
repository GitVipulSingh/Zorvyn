import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, Receipt, Heart, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { categoryConfig } from "@/utils/categoryConfig";
import { formatCurrency } from "@/utils/format";
import { groupTransactionsByDate, formatDateLabel } from "@/utils/groupByDate";
import { Button } from "@/components/ui/button";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Transaction } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  limit?: number;
}

export function ExpenseList({ limit }: Props) {
  const { transactions, deleteTransaction, user } = useFinanceStore();
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [deleteTx, setDeleteTx] = useState<Transaction | null>(null);

  const displayed = limit ? transactions.slice(0, limit) : transactions;
  const grouped = groupTransactionsByDate(displayed);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 border border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.02)] mb-5">
          <Receipt className="h-7 w-7 text-gray-500" />
        </div>
        <p className="font-semibold text-white tracking-wide">No transactions yet</p>
        <p className="text-sm text-gray-400 mt-1.5">
          Add your first expense to get started
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Controlled edit modal — opens when editTx is set */}
      {editTx && (
        <AddExpenseModal
          open={!!editTx}
          onOpenChange={(open) => {
            if (!open) setEditTx(null);
          }}
          editData={editTx}
        />
      )}

      <ConfirmDialog
        open={!!deleteTx}
        onOpenChange={(open) => !open && setDeleteTx(null)}
        title="Delete transaction?"
        description={
          deleteTx
            ? `Remove ${formatCurrency(deleteTx.amount, user.currency)} from ${deleteTx.category}?`
            : ""
        }
        onConfirm={() => deleteTx && deleteTransaction(deleteTx.id)}
      />

      <div className="space-y-5">
        {Object.entries(grouped).map(([date, txs]) => (
          <div key={date}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {formatDateLabel(date)}
              </p>
              <p className="text-xs text-gray-400">
                {formatCurrency(
                  txs.reduce((s, t) => s + t.amount, 0),
                  user.currency
                )}
              </p>
            </div>
            <div className="space-y-1.5">
              <AnimatePresence initial={false}>
                {txs.map((tx) => {
                  const meta = categoryConfig[tx.category];
                  const Icon = meta?.icon;
                  const bg = meta?.bg ?? "bg-gray-50";
                  const text = meta?.text ?? "text-gray-600";
                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      layout
                      className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 px-5 py-3.5 hover:border-white/10 hover:bg-white/[0.07] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-2xl flex-shrink-0 relative z-10",
                          bg
                        )}
                      >
                        {Icon && <Icon className={cn("h-5 w-5", text)} strokeWidth={2} />}
                      </div>
                      <div className="flex-1 min-w-0 relative z-10 flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-white tracking-wide truncate">
                            {tx.category}
                          </p>
                          {tx.intent === "Need" && <Heart className="h-3 w-3 text-blue-400" strokeWidth={3} />}
                          {tx.intent === "Want" && <Sparkles className="h-3 w-3 text-blue-400" strokeWidth={3} />}
                          {tx.intent === "Investment" && <TrendingUp className="h-3 w-3 text-emerald-400" strokeWidth={3} />}
                          {tx.intent === "Regret" && <AlertCircle className="h-3 w-3 text-rose-400" strokeWidth={3} />}
                        </div>
                        {tx.note && (
                          <p className="text-xs text-gray-400 truncate mt-1">
                            {tx.note}
                          </p>
                        )}
                      </div>
                      <p className="font-bold text-sm text-white flex-shrink-0 relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
                        -{formatCurrency(tx.amount, user.currency)}
                      </p>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2 relative z-10">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="hover:bg-white/10"
                          aria-label="Edit"
                          onClick={() => setEditTx(tx)}
                        >
                          <Pencil className="h-4 w-4 text-gray-300" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="hover:text-rose-400 hover:bg-rose-500/10"
                          aria-label="Delete"
                          onClick={() => setDeleteTx(tx)}
                        >
                          <Trash2 className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
