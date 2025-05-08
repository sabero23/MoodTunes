import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Uneix classes de Tailwind de forma intel·ligent.
 * `clsx` elimina falsos, `twMerge` resol conflictes (com p-2 vs p-4).
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
