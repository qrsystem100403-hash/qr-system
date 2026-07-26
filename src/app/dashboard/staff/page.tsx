import { requireOwnerUser } from "@/lib/requireRestaurantUser";
import StaffPageClient from "./StaffPageClient";

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
    status?: string;
    sort?: string;
  }>;
};

export default async function StaffPage({
  searchParams,
}: Props) {
  await requireOwnerUser();

  const params = await searchParams;

  return (
    <StaffPageClient
      initialPage={
        Number(params.page ?? 1)
      }
      initialSearch={
        params.search ?? ""
      }
      initialRole={
        params.role ?? "all"
      }
      initialStatus={
        params.status ?? "all"
      }
      initialSort={
        params.sort ?? "newest"
      }
    />
  );
}