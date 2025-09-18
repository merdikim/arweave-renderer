import type { TContentCategory } from "../types";
import { contentCategories } from "./constants";

export const getCategoryByMimeType = (mimeType: string): TContentCategory => {
  if (!mimeType || typeof mimeType !== "string") return "unknown";

  const normalizedMime = mimeType.toLowerCase().trim();

  for (const [category, data] of Object.entries(contentCategories)) {
    if (data.includes(normalizedMime)) {
      return category as TContentCategory;
    }
  }

  return "unknown";
};

export const isArweaveId = (addr: string) => /^[a-z0-9_-]{43}$/i.test(addr);
