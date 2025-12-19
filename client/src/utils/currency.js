export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2
  }).format(amount);
};
