import { BillingRepository } from "@/modules/billing/repositories/billing.repository";
import { MenuRepository } from "@/modules/menu/repositories/menu.repository";

import { OrderRepository } from "./repositories/order.repository";
import { OrderCreateRepository } from "./repositories/order-create.repository";
import { OrderRateLimitRepository } from "./repositories/order-rate-limit.repository";
import { OrderSessionRepository } from "./repositories/order-session.repository";
import { OrderTableRepository } from "./repositories/order-table.repository";

import { OrderBillingService } from "./services/order-billing.service";
import { OrderCreateService } from "./services/order-create.service";
import { OrderMenuValidationService } from "./services/order-menu-validation.service";
import { OrderRateLimitService } from "./services/order-rate-limit.service";
import { OrderRequestValidationService } from "./services/order-request-validation.service";
import { OrderSessionService } from "./services/order-session.service";
import { OrderTableService } from "./services/order-table.service";

const orderRepository = new OrderRepository();
const menuRepository = new MenuRepository();
const billingRepository = new BillingRepository();

const orderCreateRepository = new OrderCreateRepository();
const orderRateLimitRepository = new OrderRateLimitRepository();
const orderSessionRepository = new OrderSessionRepository();
const orderTableRepository = new OrderTableRepository();

export const orderBillingService =
  new OrderBillingService(billingRepository);

export const orderMenuValidationService =
  new OrderMenuValidationService(menuRepository);

export const orderCreateService =
  new OrderCreateService(orderCreateRepository);

export const orderRateLimitService =
  new OrderRateLimitService(orderRateLimitRepository);

export const orderSessionService =
  new OrderSessionService(
    undefined,
    undefined,
    orderSessionRepository,
  );

export const orderTableService =
  new OrderTableService(orderTableRepository);

export const requestValidationService =
  new OrderRequestValidationService();