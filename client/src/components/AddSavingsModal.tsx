import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinanceStore } from "@/store/useFinanceStore";
import { getCurrencySymbol } from "@/utils/format";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalTitle: string;
  /** Maximum amount the user can add (targetAmount - savedAmount) */
  maxAmount?: number;
  onConfirm: (amount: number) => void;
}

export function AddSavingsModal({
  open,
  onOpenChange,
  goalTitle,
  maxAmount,
  onConfirm,
}: Props) {
  const { user } = useFinanceStore();
  const symbol = getCurrencySymbol(user.currency);

  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError("Enter a valid amount greater than 0");
      return;
    }
    if (maxAmount !== undefined && parsed > maxAmount) {
      setError(`Maximum you can add is ${maxAmount.toFixed(2)}`);
      return;
    }
    onConfirm(parsed);
    setAmount("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Savings</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-400 -mt-2 mb-1">
          How much did you save towards{" "}
          <span className="font-medium text-white">{goalTitle}</span>?
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="savings-amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                {symbol}
              </span>
              <Input
                id="savings-amount"
                type="number"
                placeholder="0.00"
                className="pl-7"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                min="0.01"
                step="0.01"
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Savings
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
