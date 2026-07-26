"use client";

import { useEffect, useState } from "react";

import { useCustomerTheme } from "@/modules/customer-theme/runtime/hooks/useCustomerTheme";
import type { CustomerTheme } from "@/modules/customer-theme/types/theme";

import BrandingSection from "@/modules/customer-theme/builder/BrandingSection";
import ColorsSection from "@/modules/customer-theme/builder/ColorsSection";
import TypographySection from "@/modules/customer-theme/builder/TypographySection";
import LayoutSection from "@/modules/customer-theme/builder/LayoutSection";
import FeaturesSection from "@/modules/customer-theme/builder/FeaturesSection";
import ThemePreview from "@/modules/customer-theme/builder/ThemePreview";
import SaveBar from "@/modules/customer-theme/builder/SaveBar";

export default function CustomerThemePage() {
  const {
    theme,
    loading,
    saving,
    save,
  } = useCustomerTheme();

  const [draft, setDraft] =
    useState<CustomerTheme | null>(null);

  useEffect(() => {
    if (theme) {
      setDraft(theme);
    }
  }, [theme]);

  if (loading || !draft) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  const updateTheme = (
    updates: Partial<CustomerTheme>,
  ) => {
    setDraft((previous) =>
      previous
        ? {
            ...previous,
            ...updates,
          }
        : previous,
    );
  };

  const handleSave = async () => {
    await save(draft);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">

      <BrandingSection
        theme={draft}
        onChange={updateTheme}
      />

      <ColorsSection
        theme={draft}
        onChange={updateTheme}
      />

      <TypographySection
        theme={draft}
        onChange={updateTheme}
      />

      <LayoutSection
        theme={draft}
        onChange={updateTheme}
      />

      <FeaturesSection
        theme={draft}
        onChange={updateTheme}
      />

      <ThemePreview
        theme={draft}
      />

      <SaveBar
        saving={saving}
        onSave={handleSave}
      />

    </div>
  );
}