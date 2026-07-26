"use client";

import { useEffect, useRef, type ReactNode } from "react";

import type { CustomerTheme } from "../../types/theme";
import { applyCustomerTheme } from "../utils/applyCustomerTheme";

type Props = {
  theme: CustomerTheme;
  children: ReactNode;
};

export default function CustomerThemeProvider({
  theme,
  children,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = wrapperRef.current;

    if (!element) return;

    applyCustomerTheme(element, theme);
  }, [theme]);

  return (
    <div
      ref={wrapperRef}
      className="restaurant-theme min-h-screen"
      data-restaurant-theme
    >
      {children}
    </div>
  );
}