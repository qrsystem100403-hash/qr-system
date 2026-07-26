import {
  SessionService,
} from "@/modules/sessions";

import { TableService } from "@/modules/tables";

import { OrderSessionRepository } from "../repositories/order-session.repository";

import { ValidationError } from "@/lib/errors";

export class OrderSessionService {
  constructor(
    private readonly sessionService =
      new SessionService(),

    private readonly tableService =
      new TableService(),

    private readonly repository =
      new OrderSessionRepository(),
  ) {}

  async resolve(
    restaurantId: string,
    tableId: string,
    sessionToken?: string,
  ) {
    let session: Awaited<
      ReturnType<SessionService["getByToken"]>
    > | null = null;

    let newSessionToken: string | null = null;

    if (sessionToken) {
      try {
  session =
    await this.sessionService.getByToken(
      sessionToken,
    );

  if (session.table_id !== tableId) {
    throw new ValidationError(
      "Invalid session",
    );
  }
} catch (error) {
  if (error instanceof ValidationError) {
    throw error;
  }

  session = null;
}
    }

    if (!session) {
      session =
        await this.sessionService.getOrCreateActiveSession(
          restaurantId,
          tableId,
        );

      newSessionToken =
        session.session_token;

      await this.tableService.markOccupied(
        tableId,
      );
    }

    await this.repository.touch(session.id);

    return {
      session,
      newSessionToken,
    };
  }
}