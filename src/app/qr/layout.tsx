import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import CustomerThemeProvider from "@/modules/customer-theme/runtime/providers/CustomerThemeProvider";
import { publicRuntimeService } from "@/modules/public/services/publicRuntime.service";

type Props = {
  children: ReactNode;
};

export default async function QRLayout({
  children,
}: Props) {
  const runtime = await publicRuntimeService.resolve();

  if (!runtime) {
    notFound();
  }

  return (
    <CustomerThemeProvider theme={runtime.theme}>
      {children}
    </CustomerThemeProvider>
  );
}