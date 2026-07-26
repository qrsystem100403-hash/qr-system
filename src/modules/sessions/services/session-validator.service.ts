import { BaseService } from "@/modules/core/services/base.service";

import { TableSession } from "../types";

import { isSessionExpired } from "../utils";

export class SessionValidatorService extends BaseService {
  validate(session: TableSession) {
    if (!session.expires_at) {
      return false;
    }

    return !isSessionExpired(session.expires_at);
  }
}