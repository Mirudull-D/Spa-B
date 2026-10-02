// GST helpers. Prices are GST-EXCLUSIVE: GST is added on top of (subtotal - discount).
//
// Orders saved before the switch stored GST-INCLUSIVE totals (grand_total = subtotal -
// discount + delivery, with gst_amount embedded). There is no column flagging the
// mode, so legacy orders are detected from their own numbers.

export const calcGst = (taxableAmount: number, gstPercentage: number): number =>
  taxableAmount > 0 && gstPercentage > 0
    ? Math.round(taxableAmount * gstPercentage) / 100
    : 0;

type OrderAmounts = {
  isGst: boolean;
  subtotal: number;
  discount: number;
  gstAmount?: number;
  deliveryFee: number;
  grandTotal: number;
};

// True when GST was added on top of the taxable value (new bills).
// Legacy inclusive bills satisfy grandTotal == subtotal - discount + delivery.
export const isGstExclusive = (o: OrderAmounts): boolean => {
  if (!o.isGst || !((o.gstAmount ?? 0) > 0)) return false;
  const legacyTotal = o.subtotal - o.discount + o.deliveryFee;
  return Math.abs(o.grandTotal - legacyTotal) > 0.05;
};

// Sales value excluding GST — what the shop actually earns. GST collected is owed
// to the government, so analytics must not count it as revenue.
export const netSales = (o: OrderAmounts): number =>
  o.isGst ? o.grandTotal - (o.gstAmount ?? 0) : o.grandTotal;
