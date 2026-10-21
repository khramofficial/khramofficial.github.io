"use client";

import { useEffect, useSyncExternalStore } from "react";
import { buildCatalog, catalogFromRaw, fetchRawCatalog } from "./catalog";
import type { Catalog } from "./types";

/*
 * Pages are pre-rendered with the catalog baked in at build time (good for search engines and first paint).
 * In the browser the latest published data is fetched once per page load and every component re-renders,
 * so edits made in the admin show up right away without a rebuild.
 */
let live: Catalog | null = null;
let settled = false;
let started = false;
const listeners = new Set<() => void>();

function load() {
  if (started) return;
  started = true;
  fetchRawCatalog()
    .then((raw) => {
      if (raw.collections.length > 0) live = catalogFromRaw(raw);
    })
    .catch(() => {
      /* keep the baked catalog */
    })
    .finally(() => {
      settled = true;
      listeners.forEach((l) => l());
    });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useCatalog(): Catalog {
  const catalog = useSyncExternalStore(
    subscribe,
    () => live ?? buildCatalog,
    () => buildCatalog,
  );
  useEffect(load, []);
  return catalog;
}

/** True once the live fetch has finished, either way (the not-found page uses it to choose "loading" or "missing"). */
export function useCatalogReady(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => settled,
    () => false,
  );
}
