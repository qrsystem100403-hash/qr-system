import { BaseService } from "@/modules/core/services/base.service";

import { TableSession } from "../types";

import {
  getAutoReleaseTime,
  isSessionExpired,
} from "../utils";

export class SessionExpiryService extends BaseService {
  isExpired(session: TableSession) {
    if (!session.expires_at) {
      return true;
    }

    return isSessionExpired(session.expires_at);
  }

  getAutoReleaseAt(session: TableSession) {
    if (!session.bill_requested_at) {
      return null;
    }

    return getAutoReleaseTime(
      new Date(session.bill_requested_at)
    );
  }
}