"use client";

import { useCallback, useMemo, useState } from "react";

import type { SessionListItem } from "@/modules/sessions/types";
import { useRealtimeSessions } from "@/modules/sessions/hooks/useRealtimeSessions";

import SessionStats from "./SessionStats";
import SessionCard from "./SessionCard";
import EmptySessions from "./EmptySessions";

type Props = {
  restaurantId: string;
  initialSessions: SessionListItem[];
};

export default function SessionsPageClient({
  restaurantId,
  initialSessions,
}: Props) {
  const [sessions, setSessions] =
    useState(initialSessions);

  const loadSessions =
    useCallback(async () => {
      const response = await fetch(
        "/api/dashboard/sessions",
      );

      const data =
        await response.json();

      if (
        response.ok &&
        data.success
      ) {
        setSessions(data.sessions);
      }
    }, []);

  useRealtimeSessions({
    restaurantId,
    refresh: loadSessions,
  });

  const allSessions =
    useMemo(
      () =>
        sessions.filter(
          (session) =>
            session.orders &&
            session.orders.length > 0,
        ),
      [sessions],
    );

  const billRequested =
    useMemo(
      () =>
        allSessions.filter(
          (session) =>
            session.status ===
            "bill_requested",
        ),
      [allSessions],
    );

  const activeSessions =
    useMemo(
      () =>
        allSessions.filter(
          (session) =>
            session.status ===
            "active",
        ),
      [allSessions],
    );

  return (
    <div className="mb-20 space-y-8 md:mb-0">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">
          Dining Sessions
        </h1>

        <p className="text-sm text-[var(--color-text-muted)]">
          Monitor active tables and
          collect payments.
        </p>
      </div>

      <SessionStats
        sessions={allSessions}
      />

      {billRequested.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Bill Requested
              </h2>

              <p className="text-sm text-[var(--color-text-muted)]">
                Waiting for payment
              </p>
            </div>

            <span className="rounded-md bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
              {billRequested.length}
            </span>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {billRequested.map(
              (session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                />
              ),
            )}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Active Dining
            </h2>

            <p className="text-sm text-[var(--color-text-muted)]">
              Tables currently dining
            </p>
          </div>

          <span className="rounded-md bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            {activeSessions.length}
          </span>
        </div>

        {activeSessions.length ===
        0 ? (
          <EmptySessions />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {activeSessions.map(
              (session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                />
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}