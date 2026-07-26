"use client";

import { useCallback, useEffect, useState } from "react";

import { customerThemeApi } from "../../api/customerThemeApi";
import type {
  CustomerTheme,
  CustomerThemeUpdate,
} from "../../types/theme";

export function useCustomerTheme() {
  const [theme, setTheme] =
    useState<CustomerTheme | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await customerThemeApi.getTheme();

      setTheme(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load theme.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(
    async (
      updates: CustomerThemeUpdate,
    ) => {
      try {
        setSaving(true);
        setError(null);

        const updated =
          await customerThemeApi.updateTheme(
            updates,
          );

        setTheme(updated);

        return updated;
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to save theme.",
        );

        throw error;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    theme,
    loading,
    saving,
    error,
    refresh: load,
    save,
  };
}