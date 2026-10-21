/**
 * Public Supabase settings. The publishable key is meant to be public: Row Level Security
 * in supabase/migrations/001_khram_backend.sql decides what it can read and write.
 * Project: hobwlswwwvmfqawdgjip (account khram.official@gmail.com), separate from every Ashborne project.
 */
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://hobwlswwwvmfqawdgjip.supabase.co",
  key: process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "sb_publishable_ou_BMA_RnblMtiuvlGh-wA_CASSXdDg",
} as const;

/** The live address. GitHub Pages serves the site from the org's root domain. */
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://khramofficial.github.io";
