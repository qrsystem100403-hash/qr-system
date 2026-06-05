import Link from "next/link"
import { Search, X } from "lucide-react"

type Props = {
  searchQuery: string
}

export default function OrdersSearch({ searchQuery }: Props) {
  return (
    <form className="mb-5 flex h-12 items-center gap-3 rounded-2xl border border-[#E4DED3] bg-[#FCFAF6] px-4 dark:border-[#2A2F35] dark:bg-[#171A1F]">
      <Search className="size-4 shrink-0 text-[#98A2B3]" />

      <input
        name="q"
        defaultValue={searchQuery}
        placeholder="Search orders, customers, tables..."
        className="h-full flex-1 bg-transparent text-sm text-[#1F2933] outline-none placeholder:text-[#98A2B3] dark:text-[#E7E9EC]"
      />

      {searchQuery && (
        <Link
          href="/dashboard/orders"
          className="grid size-8 shrink-0 place-items-center rounded-full text-[#667085] transition hover:bg-[#E7F3EC] hover:text-[#2F7D57] dark:text-[#AAB2BD] dark:hover:bg-[#183026]"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </Link>
      )}

      <button
        type="submit"
        className="h-8 shrink-0 rounded-full bg-[#2F7D57] px-4 text-xs font-black text-white transition hover:bg-[#256A49]"
      >
        Search
      </button>
    </form>
  )
}