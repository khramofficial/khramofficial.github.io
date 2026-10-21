#!/usr/bin/env node
/**
 * Before each build: pull the latest products, collections and settings from Supabase
 * into src/data/snapshot.json, so every page is pre-rendered with current content (good for Google).
 * If the fetch fails, the existing snapshot is kept and the build carries on.
 */
import { readFileSync, writeFileSync } from "node:fs";

const config = readFileSync(new URL("../src/lib/config.ts", import.meta.url), "utf8");
const pick = (name, re) => process.env[name] || config.match(re)?.[1];
const url = pick("NEXT_PUBLIC_SUPABASE_URL", /url:[^"]*"(https:\/\/[^"]+)"/);
const key = pick("NEXT_PUBLIC_SUPABASE_KEY", /key:[^"]*"([^"]+)"/);
const out = new URL("../src/data/snapshot.json", import.meta.url);

async function get(path) {
  const r = await fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
  return r.json();
}

try {
  const [collections, products, settings] = await Promise.all([
    get("collections?select=*&order=sort.asc"),
    get("products?select=*&published=eq.true&order=sort.asc"),
    get("site_settings?select=data&id=eq.1"),
  ]);
  if (!Array.isArray(collections) || collections.length === 0) throw new Error("no collections returned");
  const snapshot = { collections, products, settings: settings[0]?.data ?? null, fetchedAt: new Date().toISOString() };
  writeFileSync(out, JSON.stringify(snapshot, null, 1) + "\n");
  console.log(`catalog: ${collections.length} collections, ${products.length} products from Supabase`);
} catch (e) {
  console.warn(`catalog: could not fetch from Supabase (${e.message}); keeping the existing snapshot`);
}
