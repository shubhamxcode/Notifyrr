import { z } from "zod";

export const platforms = ["amazon", "flipkart", "myntra"] as const;
export type Platform = (typeof platforms)[number];

/** One product on one platform, as read from its product page. */
export const listingSchema = z.object({
  platform: z.enum(platforms),
  externalId: z.string().min(1),
  url: z.url(),
  title: z.string().min(1),
  brand: z.string().min(1).nullable(),
  modelNumber: z.string().min(1).nullable(),
  imageUrl: z.url().nullable(),
  price: z.number().positive().nullable(),
  mrp: z.number().positive().nullable(),
  currency: z.literal("INR"),
  inStock: z.boolean(),
  seller: z.string().min(1).nullable(),
});

export type Listing = z.infer<typeof listingSchema>;

export type ProductRef = {
  externalId: string;
  canonicalUrl: string;
};

export interface PlatformAdapter {
  platform: Platform;
  /** True when this adapter owns the URL's host. */
  matches(url: URL): boolean;
  /** Extracts the platform's product id, or null if the URL is not a product page. */
  parseUrl(url: URL): ProductRef | null;
  fetchListing(ref: ProductRef): Promise<Listing>;
}

export type ScrapeErrorCode =
  | "unsupported_url"
  | "blocked"
  | "not_found"
  | "parse_failed"
  | "failed";

export class ScrapeError extends Error {
  constructor(
    readonly code: ScrapeErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ScrapeError";
  }
}
