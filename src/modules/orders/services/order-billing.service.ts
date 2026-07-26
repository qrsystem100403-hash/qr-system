import { BillingRepository } from "@/modules/billing/repositories/billing.repository";

import type { ValidatedCartItem } from "../types/order.types";
import type {
  BillingCalculation,
  BillingSettings,
} from "../types/billing.types";

export class OrderBillingService {
  constructor(
  private readonly repository = new BillingRepository(),
) {}

  private roundMoney(value: number) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  async calculate(
  restaurantId: string,
  validatedCart: ValidatedCartItem[],
): Promise<BillingCalculation> {
    const subtotal = this.roundMoney(
      validatedCart.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      ),
    );

    const billingSettings =
      await this.repository.getBillingSettings(
        restaurantId,
      );

    const billing: BillingSettings = billingSettings ?? {
  gst_enabled: false,
  gst_mode: "exclusive",
  gst_percent: 0,
  service_charge_enabled: false,
  service_charge_type: "percentage",
  service_charge_value: 0,
  round_off_enabled: false,
};

    let serviceCharge = 0;

    if (billing.service_charge_enabled) {
      serviceCharge =
        billing.service_charge_type === "fixed"
          ? billing.service_charge_value
          : (subtotal *
              billing.service_charge_value) /
            100;
    }

    serviceCharge =
      this.roundMoney(serviceCharge);

    const taxableAmount =
      this.roundMoney(
        subtotal + serviceCharge,
      );

    let gstAmount = 0;

    if (billing.gst_enabled) {
      if (billing.gst_mode === "inclusive") {
        gstAmount =
          taxableAmount -
          taxableAmount /
            (1 + billing.gst_percent / 100);
      } else {
        gstAmount =
          (taxableAmount *
            billing.gst_percent) /
          100;
      }
    }

    gstAmount =
      this.roundMoney(gstAmount);

    const beforeRound =
      this.roundMoney(
        billing.gst_mode === "inclusive"
          ? taxableAmount
          : taxableAmount + gstAmount,
      );

    const grandTotal =
      billing.round_off_enabled
        ? Math.round(beforeRound)
        : beforeRound;

    const roundOff =
      this.roundMoney(
        grandTotal - beforeRound,
      );

    return {
      billing,
      subtotal,
      serviceCharge,
      gstAmount,
      roundOff,
      grandTotal,
    };
  }
}