import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, Receipt } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 mb-4">
          <Receipt className="h-6 w-6 text-gray-400" />
        </div>
        <p className="font-semibold text-gray-700">No transactions yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Add your first expense to get started
        </p>
      </div>
    );
  }

  return (
    <>
      {editTx && (
        <AddExpenseModal
          editData={editTx}
          onClose={() => setEditTx(null)}
          trigger={<span className="hidden" />}
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
                  const { icon: Icon, bg, text } = categoryConfig[tx.category];
                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      layout
                      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 hover:border-gray-200 hover:shadow-sm transition-all group"
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0",
                          bg
                        )}
                      >
                        <Icon className={cn("h-4 w-4", text)} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {tx.category}
                        </p>
                        {tx.note && (
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {tx.note}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-sm text-gray-900 flex-shrink-0">
                        -{formatCurrency(tx.amount, user.currency)}
                      </p>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Edit"
                          onClick={() => setEditTx(tx)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                          aria-label="Delete"
                          onClick={() => setDeleteTx(tx)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
