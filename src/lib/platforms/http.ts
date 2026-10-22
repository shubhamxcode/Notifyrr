import "server-only";

import { ScrapeError } from "./types";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

const MAX_HTML_BYTES = 5 * 1024 * 1024;

/**
 * Fetches a product page as HTML. Callers pass only URLs they built from an
 * allowlisted host, and `allowedHosts` is re-checked after redirects, so a
 * user-supplied URL can never steer the request somewhere else.
 */
export async function fetchHtml(url: string, allowedHosts: readonly string[]) {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-IN,en;q=0.9",
      },
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    throw new ScrapeError("failed", `Request failed: ${(error as Error).message}`);
  }

  if (!allowedHosts.includes(new URL(response.url).hostname)) {
    throw new ScrapeError("blocked", `Redirected off-platform to ${response.url}`);
  }

  if (response.status === 404) {
    throw new ScrapeError("not_found", "Product page not found");
  }

  if (response.status === 429 || response.status === 503) {
    throw new ScrapeError("blocked", `Platform returned ${response.status}`);
  }

  if (!response.ok) {
    throw new ScrapeError("failed", `Platform returned ${response.status}`);
  }

  const length = Number(response.headers.get("content-length") ?? 0);
  if (length > MAX_HTML_BYTES) {
    throw new ScrapeError("failed", "Page is too large");
  }

  return response.text();
}

/** "₹1,099.00" → 1099. Returns null for anything that is not a positive amount. */
export function parseInrAmount(text: string | undefined | null) {
  if (!text) return null;
  const digits = text.replace(/[^0-9.]/g, "");
  if (!digits) return null;
  const value = Number.parseFloat(digits);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function cleanText(text: string | undefined | null) {
  const value = text?.replace(/[\u200e\u200f]/g, "").replace(/\s+/g, " ").trim();
  return value ? value : null;
}
