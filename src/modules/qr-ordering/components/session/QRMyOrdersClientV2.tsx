"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, ReceiptText } from "lucide-react";

import type {
  DiningSession,
  SessionOrder,
  SessionResponse,
} from "@/modules/qr-ordering/types/session";

import SessionSummary from "./SessionSummary";
import SessionOrderCard from "./SessionOrderCard";
import SessionActions from "./SessionActions";
import OtherRequestModal from "./OtherRequestModal";

type Props = {
  table: string;
  tableToken: string;
  restaurantPhone?: string | null;
};

export default function QRMyOrdersClientV2({
  table,
  tableToken,
  restaurantPhone,
}: Props) {
  const [session, setSession] =
    useState<DiningSession | null>(null);

  const [orders, setOrders] =
    useState<SessionOrder[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [requestingBill, setRequestingBill] =
    useState(false);

  const [billRequested, setBillRequested] =
    useState(false);

  const [requestedTypes, setRequestedTypes] =
  useState<Record<string, number>>({});

  const [requestingKey, setRequestingKey] =
    useState<string | null>(null);

  const [showOtherModal, setShowOtherModal] =
    useState(false);

  const [otherMessage, setOtherMessage] =
    useState("");

  const [sendingOther, setSendingOther] =
    useState(false);

  const latestOrder = useMemo(() => {
  if (!orders.length) return null;

  return [...orders].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  )[0];
}, [orders]);

  const sessionTotal = useMemo(() => {
  return orders.reduce(
    (sum, order) => sum + Number(order.total ?? 0),
    0
  );
}, [orders]);

  const loadSession = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/qr/session/orders",
        {
          cache: "no-store",
        }
      );

      const data: SessionResponse =
        await response.json();

      if (!response.ok || !data.success) {
        setSession(null);
        setOrders([]);
        return;
      }

      setSession(data.session);
      setOrders(data.orders);

      if (
        data.session.status ===
        "bill_requested"
      ) {
        setBillRequested(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();

    const interval = window.setInterval(
      loadSession,
      15000
    );

    return () => clearInterval(interval);
  }, [loadSession]);

  async function handleRequestBill() {
    if (!latestOrder) return;

    try {
      setRequestingBill(true);

      const response = await fetch(
        "/api/qr/request-bill",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            orderId: latestOrder.id,
            trackingToken:
              latestOrder.tracking_token,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.error ??
            "Failed to request bill."
        );
        return;
      }

      setBillRequested(true);
      loadSession();
    } catch {
      alert("Failed to request bill.");
    } finally {
      setRequestingBill(false);
    }
  }

  async function handleRequest(
    type: string
  ) {
    if (!latestOrder) return;

    if (type === "other") {
      setShowOtherModal(true);
      return;
    }

    try {
      setRequestingKey(type);

      const response = await fetch(
        "/api/qr/request-waiter",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            orderId: latestOrder.id,
            trackingToken:
              latestOrder.tracking_token,
            requestType: type,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error);
      }

      setRequestedTypes((prev) => ({
  ...prev,
  [type]: Date.now(),
}));
    } catch {
      alert(
        "Unable to send request."
      );
    } finally {
      setRequestingKey(null);
    }
  }

  useEffect(() => {
  const interval = setInterval(() => {
    setRequestedTypes((prev) => {
      const updated = { ...prev };

      Object.entries(updated).forEach(([key, time]) => {
        if (Date.now() - time > 2 * 60 * 1000) {
          delete updated[key];
        }
      });

      return updated;
    });
  }, 10000);

  return () => clearInterval(interval);
}, []);

  async function submitOtherRequest() {
    if (
      !latestOrder ||
      !otherMessage.trim()
    )
      return;

    try {
      setSendingOther(true);

      const response = await fetch(
        "/api/qr/request-waiter",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            orderId: latestOrder.id,
            trackingToken:
              latestOrder.tracking_token,
            requestType: "other",
            customMessage:
              otherMessage.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error);
      }

      setRequestedTypes((prev) => ({
  ...prev,
  other: Date.now(),
}));

      setShowOtherModal(false);
      setOtherMessage("");
    } catch {
      alert(
        "Unable to send request."
      );
    } finally {
      setSendingOther(false);
    }
  }
    if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-gold)]" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <ReceiptText className="mx-auto h-12 w-12 text-[var(--color-gold)]" />

        <h2 className="mt-5 text-2xl font-black">
          No Active Dining Session
        </h2>

        <p className="mt-3 text-[var(--color-text-muted)]">
          Start ordering from the menu to create a dining session.
        </p>

        <Link
          href={`/qr/table/${tableToken}`}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--color-gold)] px-6 font-bold text-black"
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-5 pb-24 md:pb-5">

        <div className="mb-5 flex items-center justify-between">

          <Link
            href={`/qr/table/${tableToken}`}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Menu
          </Link>

          <div className="rounded-full bg-[var(--color-gold)]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--color-gold)]">
            {table}
          </div>

        </div>

        <SessionSummary
  session={session}
  orderCount={orders.length}
  total={sessionTotal}
/>

        <div className="mt-6">
  {orders.length === 0 ? (
    <div className="rounded-3xl border border-white/10 p-10 text-center">
      <ReceiptText className="mx-auto h-10 w-10 text-[var(--color-gold)]" />

      <h3 className="mt-4 text-xl font-black">
        No Orders Yet
      </h3>

      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        Place your first order to begin this dining session.
      </p>
    </div>
  ) : (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black">
          Your Orders
        </h2>

        <span className="text-sm text-[var(--color-text-muted)]">
          ↓ Latest First
        </span>
      </div>

      <div className="space-y-5">
        {[...orders]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .map((order, index) => (
            <SessionOrderCard
              key={order.id}
              order={order}
              tableToken={tableToken}
              orderNumber={orders.length - index}
            />
          ))}
      </div>
    </>
  )}
</div>

        <div className="mt-8">

          <SessionActions
            restaurantPhone={restaurantPhone}
            requestingBill={requestingBill}
            billRequested={billRequested}
            onRequestBill={handleRequestBill}
            requestingKey={requestingKey}
            requestedTypes={requestedTypes}
            onRequest={handleRequest}
          />

        </div>

      </div>

      <OtherRequestModal
        open={showOtherModal}
        value={otherMessage}
        loading={sendingOther}
        onChange={setOtherMessage}
        onClose={() => {
          setShowOtherModal(false);
          setOtherMessage("");
        }}
        onSubmit={submitOtherRequest}
      />
    </>
  );
}