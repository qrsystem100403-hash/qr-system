import { randomBytes } from "crypto";

import { BaseService } from "@/modules/core/services/base.service";

export class SessionTokenService extends BaseService {
  generate(length = 32) {
    return randomBytes(length).toString("hex");
  }

  equals(
    storedToken: string | null,
    providedToken: string | null
  ) {
    if (!storedToken || !providedToken) {
      return false;
    }

    return storedToken === providedToken;
  }
}