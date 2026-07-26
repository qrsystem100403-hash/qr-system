import { BaseService } from "@/modules/core/services/base.service";

import { SessionRepository } from "../repositories";
import { TableSession } from "../types";
import { TableService } from "@/modules/tables";

import {
  SessionExpiredError,
  SessionNotFoundError,
} from "../errors";

import { getSessionExpiry } from "../utils";
import { SessionLifecycleService } from "./session-lifecycle.service";


import { SessionTokenService } from "./session-token.service";

export class SessionService extends BaseService {
  private readonly repository =
    new SessionRepository();

  private readonly tokenService =
    new SessionTokenService();

  private readonly tableService =
  new TableService();

  private readonly lifecycle =
  new SessionLifecycleService();

  async findByToken(
    token: string
  ): Promise<TableSession | null> {
    return this.repository.findByToken(token);
  }

  async getByToken(
    token: string
  ): Promise<TableSession> {
    const session =
      await this.findByToken(token);

    if (!session) {
      throw new SessionNotFoundError();
    }

    if (!this.lifecycle.canUse(session)) {
  throw new SessionExpiredError();
}

    return session;
  }

  async findActiveByTableId(
    tableId: string
  ) {
    return this.repository.findActiveByTableId(
      tableId
    );
  }

  async touch(sessionId: string) {
  return this.repository.touch(sessionId);
}

async markBillRequested(
  sessionId: string,
  tableId: string,
  billing: {
    subtotal: number;
    gst_percent: number | null;
    gst_amount: number;
    service_charge_type: string |null;
    service_charge_value: number | null;
    service_charge_amount: number;
    round_off: number;
    grand_total: number;
    billing_snapshot: any;
  }
) {
  await this.repository.markBillRequested(
    sessionId,
    billing
  );

  await this.tableService.markBillRequested(
    tableId
  );
}

  async createSession(
    restaurantId: string,
    tableId: string
  ) {
    return this.repository.create({
      restaurant_id: restaurantId,
      table_id: tableId,
      session_token:
        this.tokenService.generate(),
      expires_at:
        getSessionExpiry().toISOString(),
    });
  }

  async getOrCreateActiveSession(
  restaurantId: string,
  tableId: string
) {
  const existing =
    await this.findActiveByTableId(
      tableId
    );

  if (
  existing &&
  this.lifecycle.canUse(existing)
) {
  return existing;
}

  if (existing) {
    await this.expireSession(
      existing.id
    );
  }

  try {
    return await this.createSession(
      restaurantId,
      tableId
    );
  } catch (error) {
    /*
      Another request may have created the
      active session first.

      Read it again instead of failing.
    */

    const concurrent =
      await this.findActiveByTableId(
        tableId
      );

    if (
  concurrent &&
  this.lifecycle.canUse(concurrent)
) {
  return concurrent;
}

    throw error;
  }
}

  async completeSession(
    sessionId: string
  ) {
    return this.repository.complete(
      sessionId
    );
  }

  async expireSession(
  sessionId: string,
  tableId?: string
) {
  let resolvedTableId = tableId;

  if (!resolvedTableId) {
    const session =
      await this.repository.findById(sessionId);

    if (session) {
      resolvedTableId = session.table_id;
    }
  }

  await this.repository.expire(sessionId);

  if (resolvedTableId) {
    await this.tableService.markAvailable(
      resolvedTableId
    );
  }
}

  async validateToken(
    token: string
  ) {
    return this.getByToken(token);
  }

  async exists(
    token: string
  ) {
    return (
      (await this.findByToken(token)) !==
      null
    );
  }

  async completeAndFreeTable(
  sessionId: string,
  tableId: string
) {
  await this.completeSession(sessionId);
await this.tableService.markAvailable(tableId);
}
}