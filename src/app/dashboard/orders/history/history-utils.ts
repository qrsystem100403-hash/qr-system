export function buildHistoryHref({
  status,
  q,
  selected,
}: {
  status: "all" | "served" | "cancelled";
  q?: string;
  selected?: string;
}) {
  const params = new URLSearchParams();

  if (status !== "all") {
    params.set("status", status);
  }

  if (q?.trim()) {
    params.set("q", q.trim());
  }

  if (selected) {
    params.set("selected", selected);
  }

  const query = params.toString();

  return query
    ? `/dashboard/orders/history?${query}`
    : "/dashboard/orders/history";
}