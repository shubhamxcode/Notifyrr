import "server-only";

import * as cheerio from "cheerio";
import { cleanText, fetchHtml, parseInrAmount } from "./http";
import {
  listingSchema,
  ScrapeError,
  type Listing,
  type PlatformAdapter,
  type ProductRef,
} from "./types";

const HOSTS = ["www.amazon.in", "amazon.in", "m.amazon.in"] as const;
const ASIN_PATTERN = /\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})(?:[/?]|$)/i;

export function parseAmazonUrl(url: URL): ProductRef | null {
  if (!(HOSTS as readonly string[]).includes(url.hostname)) return null;
  const asin = url.pathname.match(ASIN_PATTERN)?.[1]?.toUpperCase();
  if (!asin) return null;
  return { externalId: asin, canonicalUrl: `https://www.amazon.in/dp/${asin}` };
}

/** Pure HTML → Listing parser, kept separate from the network so it can be tested on saved pages. */
export function parseAmazonHtml(html: string, ref: ProductRef): Listing {
  const $ = cheerio.load(html);

  if ($("form[action*='validateCaptcha']").length > 0) {
    throw new ScrapeError("blocked", "Amazon served a captcha");
  }

  const text = (selector: string) => cleanText($(selector).first().text());

  const title = text("#productTitle");
  if (!title) {
    throw new ScrapeError("parse_failed", "Product title not found");
  }

  const priceBlock = "#corePriceDisplay_desktop_feature_div";
  const price =
    parseInrAmount(text(`${priceBlock} .priceToPay .a-price-whole`)) ??
    parseInrAmount(text(`${priceBlock} .a-price-whole`)) ??
    parseInrAmount(text("#apex_desktop .a-price .a-offscreen"));

  const mrp =
    parseInrAmount(text(`${priceBlock} .basisPrice .a-offscreen`)) ??
    parseInrAmount(text(`${priceBlock} .a-price.a-text-price .a-offscreen`));

  const availability = text("#availability > span") ?? text("#availability span") ?? "";
  const unavailable = /currently unavailable|out of stock/i.test(availability);
  const inStock = !unavailable && price !== null;

  const byline = text("#bylineInfo");
  const brand =
    cleanText(byline?.replace(/^Visit the\s+/i, "").replace(/\s+Store$/i, "").replace(/^Brand:\s*/i, "")) ?? null;

  let modelNumber: string | null = null;
  $("#productDetails_techSpec_section_1 tr, #productDetails_detailBullets_sections1 tr").each((_, row) => {
    if (/item model number/i.test($(row).find("th").text())) {
      modelNumber = cleanText($(row).find("td").text());
      return false;
    }
  });
  if (!modelNumber) {
    $("#detailBullets_feature_div li").each((_, item) => {
      const line = cleanText($(item).text()) ?? "";
      const match = line.match(/item model number\s*:?\s*(.+)$/i);
      if (match) {
        modelNumber = cleanText(match[1]);
        return false;
      }
    });
  }

  const image = $("#landingImage");
  const imageUrl = image.attr("data-old-hires") || image.attr("src") || null;

  const seller =
    text("#sellerProfileTriggerId") ??
    text("#merchantInfoFeature_feature_div .offer-display-feature-text-message");

  const parsed = listingSchema.safeParse({
    platform: "amazon",
    externalId: ref.externalId,
    url: ref.canonicalUrl,
    title,
    brand,
    modelNumber,
    imageUrl: imageUrl?.startsWith("https://") ? imageUrl : null,
    price,
    mrp: mrp && price && mrp > price ? mrp : null,
    currency: "INR",
    inStock,
    seller,
  });

  if (!parsed.success) {
    throw new ScrapeError("parse_failed", parsed.error.message);
  }

  return parsed.data;
}

export const amazonAdapter: PlatformAdapter = {
  platform: "amazon",
  matches: (url) => (HOSTS as readonly string[]).includes(url.hostname),
  parseUrl: parseAmazonUrl,
  async fetchListing(ref) {
    const html = await fetchHtml(ref.canonicalUrl, HOSTS);
    return parseAmazonHtml(html, ref);
  },
};
