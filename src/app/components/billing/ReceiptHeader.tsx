import { UtensilsCrossed, Phone, MapPin } from "lucide-react";
import type { ReceiptRestaurant } from "./receipt-types";

type Props = {
  restaurant: ReceiptRestaurant;
};

export default function ReceiptHeader({
  restaurant,
}: Props) {
  const branding =
    restaurant.branding ?? "logo_name";

  const showLogo =
    branding === "logo" ||
    branding === "logo_name";

  const showName =
    branding === "name" ||
    branding === "logo_name";

  const showDetails =
    branding !== "compact";

  return (
    <header className="text-center">

      {/* Logo */}

      {showLogo && (
        <div className="mb-3 flex justify-center">
          {restaurant.logo ? (
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 bg-neutral-100">
              <UtensilsCrossed className="h-7 w-7 text-neutral-700" />
            </div>
          )}
        </div>
      )}

      {/* Restaurant Name */}

      {showName && (
        <h1 className="text-[22px] tracking-[0.08em] leading-tight font-black uppercase  leading-none">
          {restaurant.name}
        </h1>
      )}

      {/* Tagline */}

      {showDetails && restaurant.tagline && (
        <p className="mt-2 text-[10px] italic text-neutral-500">
          {restaurant.tagline}
        </p>
      )}

      {/* Address */}

      {showDetails && restaurant.address && (
        <div className="mt-4 flex items-start justify-center gap-2 text-[10px] leading-5 text-neutral-700 max-w-[230px] mx-auto">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{restaurant.address}</span>
        </div>
      )}

      {/* Phone */}

      {showDetails && restaurant.phone && (
        <div className="mt-2 flex items-center justify-center gap-2 text-[10px] font-medium">
          <Phone className="h-3.5 w-3.5" />
          <span>{restaurant.phone}</span>
        </div>
      )}

      {/* GST */}

      {restaurant.gstin && (
        <p className="mt-3 text-[9px] font-semibold tracking-wide">
          GSTIN : {restaurant.gstin}
        </p>
      )}

      {/* FSSAI */}

      {restaurant.fssai && (
        <p className="mt-1 text-[10px] font-semibold tracking-wide">
          FSSAI : {restaurant.fssai}
        </p>
      )}

      {/* Tax Invoice */}

      <div className="mt-4">
        <div className="border-t border-dashed border-neutral-300" />

        <div className="py-2">
          <p className="text-[12px] font-black uppercase tracking-[0.25em]">
            Tax Invoice
          </p>
        </div>

        <div className="border-t border-dashed border-neutral-300" />
      </div>

    </header>
  );
}