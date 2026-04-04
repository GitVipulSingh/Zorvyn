import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Heart, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { useFinanceStore } from "@/store/useFinanceStore";
import { CATEGORIES, categoryConfig } from "@/utils/categoryConfig";
import { getCurrencySymbol } from "@/utils/format";
import { Transaction, Intent } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  trigger?: React.ReactNode;
  editData?: Transaction;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const INTENT_OPTIONS: { value: Intent; label: string; icon: any; color: string; bgClass: string; borderClass: string }[] = [
  { value: "Need", label: "Need", icon: Heart, color: "text-blue-400", bgClass: "bg-blue-500/10", borderClass: "border-blue-500/20" },
  { value: "Want", label: "Want", icon: Sparkles, color: "text-blue-400", bgClass: "bg-blue-500/10", borderClass: "border-blue-500/20" },
  { value: "Investment", label: "Growth", icon: TrendingUp, color: "text-emerald-400", bgClass: "bg-emerald-500/10", borderClass: "border-emerald-500/20" },
  { value: "Regret", label: "Regret", icon: AlertCircle, color: "text-rose-400", bgClass: "bg-rose-500/10", borderClass: "border-rose-500/20" },
];

export function AddExpenseModal({
  trigger,
  editData,
  onClose,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: Props) {
  const { user } = useFinanceStore();
  const symbol = getCurrencySymbol(user.currency);

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) setInternalOpen(value);
    controlledOnOpenChange?.(value);
    if (!value) onClose?.();
  };

  const { form, setField, error, submit, reset } = useTransactionForm({
    editData,
    onSuccess: () => handleOpenChange(false),
  });

  useEffect(() => {
    if (!open) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      {!trigger && !isControlled && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-white tracking-wide">{editData ? "Edit Expense" : "Add Expense"}</DialogTitle>
        </DialogHeader>
        <motion.form
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Amount and Category horizontally on desktop */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                  {symbol}
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-7"
                  value={form.amount}
                  onChange={(e) => setField("amount", e.target.value)}
                  min="0.01"
                  step="0.01"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setField("category", v as typeof form.category)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => {
                    const { icon: Icon } = categoryConfig[cat];
                    return (
                      <SelectItem key={cat} value={cat}>
                        <span className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
                          {cat}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setField("date", e.target.value)}
              required
            />
          </div>

          {/* Intent Toggles */}
          <div className="space-y-2 pt-1 border-t border-white/5 mt-2">
            <Label>
              Spending Intent <span className="text-gray-500 font-normal text-[10px] uppercase ml-1 tracking-widest">(Mindful Tracking)</span>
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {INTENT_OPTIONS.map((opt) => {
                const isSelected = form.intent === opt.value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setField("intent", isSelected ? "" : opt.value)}
                    className={cn(
                      "flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all duration-300",
                      isSelected
                        ? `${opt.bgClass} ${opt.borderClass}`
                        : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 mb-1.5 transition-colors duration-300", isSelected ? opt.color : "text-gray-500")} strokeWidth={2} />
                    <span className={cn("text-[10px] font-bold tracking-wider uppercase transition-colors duration-300", isSelected ? opt.color : "text-gray-500")}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1.5 pt-1 border-t border-white/5 mt-2">
            <Label htmlFor="note">
              Note{" "}
              <span className="text-gray-500 font-normal text-xs">(optional)</span>
            </Label>
            <Input
              id="note"
              placeholder="What was this for?"
              value={form.note}
              onChange={(e) => setField("note", e.target.value)}
              maxLength={200}
            />
          </div>

          {error && (
            <p className="text-xs text-rose-500 flex items-center gap-1 font-medium drop-shadow-[0_0_5px_rgba(244,63,94,0.3)]">{error}</p>
          )}

          <Button type="submit" className="w-full" size="lg">
            {editData ? "Save Changes" : "Add Expense"}
          </Button>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
