const amounts = ["amountTo", "amountExpectedTo", "amount_base"];

export const findBalanceFromProvider = (providerOrder) => ({
  toAmount:
    providerOrder.expectedAmountTo ||
    providerOrder.amountExpectedTo ||
    providerOrder.amountTo ||
    providerOrder.amount_base,
});
