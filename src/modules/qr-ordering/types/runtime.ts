import type { PublicRuntime } from "@/modules/public/types/runtime";
import type { PublicMenu } from "./menu";

export interface RuntimeTable {
  id: string;
  name: string;
  qrToken: string;
  isActive: boolean;
}

export interface QRPageRuntime {
  runtime: PublicRuntime;
  table: RuntimeTable;
  menu: PublicMenu;
}