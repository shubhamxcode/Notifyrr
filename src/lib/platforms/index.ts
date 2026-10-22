import "server-only";

import { amazonAdapter } from "./amazon";
import { ScrapeError, type PlatformAdapter } from "./types";

// Flipkart and Myntra adapters plug in here with the same interface.
const adapters: PlatformAdapter[] = [amazonAdapter];

/** Resolves a user-pasted URL to its platform adapter and product reference. */
export function resolveProductUrl(input: string) {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new ScrapeError("unsupported_url", "That doesn't look like a valid link");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new ScrapeError("unsupported_url", "Only web links are supported");
  }

  const adapter = adapters.find((candidate) => candidate.matches(url));
  if (!adapter) {
    throw new ScrapeError("unsupported_url", "We support Amazon.in links for now");
  }

  const ref = adapter.parseUrl(url);
  if (!ref) {
    throw new ScrapeError("unsupported_url", "Paste the link of a single product page");
  }

  return { adapter, ref };
}

export { ScrapeError } from "./types";
export type { Listing, Platform } from "./types";
