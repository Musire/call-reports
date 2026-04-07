export const formatCurrency = (value: string | number): string => {
  let amount = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(amount)) amount = 0;

  // Manually round first:
  const roundedAmount = Math.round((amount + Number.EPSILON) * 100) / 100;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundedAmount);
};
