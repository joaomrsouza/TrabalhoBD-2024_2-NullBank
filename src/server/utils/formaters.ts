export function formatCurrency(value: number) {
  return Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(value);
}

export function formatData(value: Date) {
  return value.toISOString().split("T")[0]?.split("-").reverse().join("/")
}