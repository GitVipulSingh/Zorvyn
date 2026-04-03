import { useState } from "react";
import { Category, Transaction } from "@/types";
import { useFinanceStore } from "@/store/useFinanceStore";

const MAX_NOTE_LENGTH = 200;

interface FormState {
  amount: string;
  category: Category;
  date: string;
  note: string;
}

interface UseTransactionFormOptions {
  editData?: Transaction;
  onSuccess?: () => void;
}

export function useTransactionForm({ editData, onSuccess }: UseTransactionFormOptions = {}) {
  const { addTransaction, updateTransaction } = useFinanceStore();

  const [form, setForm] = useState<FormState>({
    amount: editData?.amount?.toString() ?? "",
    category: editData?.category ?? "Food & Dining",
    date: editData?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    note: editData?.note ?? "",
  });

  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const reset = () => {
    setForm({
      amount: "",
      category: "Food & Dining",
      date: new Date().toISOString().slice(0, 10),
      note: "",
    });
    setError(null);
  };

  const submit = (): boolean => {
    const parsed = parseFloat(form.amount);
    if (!form.amount || isNaN(parsed) || parsed <= 0) {
      setError("Please enter a valid amount greater than 0");
      return false;
    }

    if (!form.date) {
      setError("Please select a date");
      return false;
    }

    const payload = {
      amount: parsed,
      category: form.category,
      date: form.date,
      note: form.note.trim().slice(0, MAX_NOTE_LENGTH),
    };

    if (editData) {
      updateTransaction(editData.id, payload);
    } else {
      addTransaction(payload);
    }

    reset();
    onSuccess?.();
    return true;
  };

  return { form, setField, error, submit, reset };
}
