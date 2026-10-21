"use client";

import { seedCollections, seedProducts, seedSettings } from "@/data/seed";
import { collectionToRow, productToRow } from "@/lib/catalog";
import { sb } from "./lib";

/**
 * First admin login on an empty database: copy the current catalogue (INDIGO, CRIMSON, SAFFRON, EBONY
 * and their products) into Supabase so it can be edited. Runs once: after this the settings row exists.
 */
export async function seedIfEmpty(): Promise<"seeded" | "skipped"> {
  const client = sb();
  const [cols, settings] = await Promise.all([
    client.from("collections").select("slug", { count: "exact", head: true }),
    client.from("site_settings").select("id").eq("id", 1).maybeSingle(),
  ]);
  if (cols.error || settings.error) throw cols.error ?? settings.error;
  if ((cols.count ?? 0) > 0 || settings.data) return "skipped";

  const c = await client.from("collections").upsert(seedCollections.map(collectionToRow));
  if (c.error) throw c.error;
  const p = await client.from("products").upsert(seedProducts.map(productToRow));
  if (p.error) throw p.error;
  const s = await client.from("site_settings").upsert({ id: 1, data: seedSettings });
  if (s.error) throw s.error;
  return "seeded";
}
