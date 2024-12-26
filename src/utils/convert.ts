export const formatCurrency = (amount: number) => {
  const numberPrice = Number(amount);
  return numberPrice.toLocaleString("en-US");
};
