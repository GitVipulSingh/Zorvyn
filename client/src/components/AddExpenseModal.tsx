import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
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
import { CATEGORIES, categoryConfig } from "@/utils/categoryConfig";
import { Transaction } from "@/types";

interface Props {
  trigger?: React.ReactNode;
  editData?: Transaction;
  onClose?: () => void;
}

export function AddExpenseModal({ trigger, editData, onClose }: Props) {
  const [open, setOpen] = useState(false);

  const { form, setField, error, submit, reset } = useTransactionForm({
    editData,
    onSuccess: () => {
      setOpen(false);
      onClose?.();
    },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Expense" : "Add Expense"}</DialogTitle>
        </DialogHeader>
        <motion.form
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                $
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
            {error && (
              <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>
            )}
          </div>

          {/* Category */}
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
                        <Icon className="h-3.5 w-3.5 text-gray-500" strokeWidth={2} />
                        {cat}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
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

          {/* Note */}
          <div className="space-y-1.5">
            <Label htmlFor="note">
              Note{" "}
              <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </Label>
            <Input
              id="note"
              placeholder="What was this for?"
              value={form.note}
              onChange={(e) => setField("note", e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            {editData ? "Save Changes" : "Add Expense"}
          </Button>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
