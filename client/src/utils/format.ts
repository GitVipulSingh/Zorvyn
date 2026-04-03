export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function getCurrencySymbol(currency = "USD"): string {
  return (
    new Intl.NumberFormat(undefined, { style: "currency", currency })
      .formatToParts(0)
      .find((p) => p.type === "currency")?.value ?? "$"
  );
}
