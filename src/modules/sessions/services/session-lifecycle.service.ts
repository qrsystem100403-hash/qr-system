import { BaseService } from "@/modules/core/services/base.service";
import { TableSession } from "../types";
import { isSessionExpired } from "../utils";

export class SessionLifecycleService extends BaseService {
  canUse(session: TableSession) {
  return (
    ["active", "bill_requested"].includes(session.status) &&
    session.expires_at !== null &&
    !isSessionExpired(session.expires_at)
  );
}

  canPlaceOrder(session: TableSession) {
  return (
    session.status === "active" &&
    session.expires_at !== null &&
    !isSessionExpired(session.expires_at)
  );
}

  canRequestBill(session: TableSession) {
    return (
      session.status === "active" &&
      session.expires_at !== null &&
      !isSessionExpired(session.expires_at)
    );
  }

  canComplete(session: TableSession) {
    return session.status === "bill_requested";
  }

  canExpire(session: TableSession) {
  return (
    session.status !== "completed" &&
    session.status !== "expired" &&
    session.expires_at !== null &&
    isSessionExpired(session.expires_at)
  );
}

  canRecover(session: TableSession) {
  return (
    ["active", "bill_requested"].includes(session.status) &&
    session.expires_at !== null &&
    !isSessionExpired(session.expires_at)
  );
}
}