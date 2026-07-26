"use client";

import { printReceipt } from "@/modules/receipt/printer/printReceipt";

type Props = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
};

export default function PrintBillButton({
  children,
  className,
  disabled,
  onBeforePrint,
  onAfterPrint,
}: Props) {
  function handlePrint() {
    if (disabled) return;

    onBeforePrint?.();

    setTimeout(async () => {
  await printReceipt();

  setTimeout(() => {
    onAfterPrint?.();
  }, 500);
}, 100);
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}