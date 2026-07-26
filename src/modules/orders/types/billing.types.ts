export type BillingSettings = {
  gst_enabled: boolean;
  gst_mode: "inclusive" | "exclusive";
  gst_percent: number;

  service_charge_enabled: boolean;
  service_charge_type: "fixed" | "percentage";
  service_charge_value: number;

  round_off_enabled: boolean;
};

export type BillingCalculation = {
  billing: BillingSettings;

  subtotal: number;
  serviceCharge: number;
  gstAmount: number;
  roundOff: number;
  grandTotal: number;
};