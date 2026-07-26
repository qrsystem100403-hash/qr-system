"use client";

import { useRouter, useSearchParams } from "next/navigation";
import DashboardPagination from "@/app/components/dashboard/ui/DashboardPagination";

type Props = {
  page: number;
  totalPages: number;
  totalItems: number;
};

export default function MenuPagination({
  page,
  totalPages,
  totalItems,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const changePage = (nextPage: number) => {
    const search = new URLSearchParams(params.toString());

    if (nextPage <= 1) {
      search.delete("page");
    } else {
      search.set("page", String(nextPage));
    }

    router.push(`/dashboard/menu?${search.toString()}`);
  };

  return (
    <DashboardPagination
      page={page}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={12}
      onPageChange={changePage}
    />
  );
}