import { browserPrinter } from "./browserPrinter";
import { tauriPrinter } from "./tauriPrinter";
import { isTauri } from "./isTauri";

export async function printReceipt() {
  if (isTauri()) {
    return tauriPrinter();
  }

  return browserPrinter();
}