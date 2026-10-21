"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { CollectionsAdmin } from "./Collections";
import { seedIfEmpty } from "./firstRun";
import { errText, sb } from "./lib";
import { ProductsAdmin } from "./Products";
import { SettingsAdmin } from "./Settings";
import { StatsAdmin } from "./Stats";

type Tab = "stats" | "products" | "collections" | "settings";
const tabs: { id: Tab; label: string }[] = [
  { id: "stats", label: "ภาพรวม" },
  { id: "products", label: "สินค้า" },
  { id: "collections", label: "คอลเลกชัน" },
  { id: "settings", label: "ตั้งค่าเว็บ" },
];

const TAB_KEY = "khram_admin_tab";
const IGNORE_KEY = "khram_ignore";

function readTab(): Tab {
  try {
    const t = sessionStorage.getItem(TAB_KEY) as Tab | null;
    if (t && tabs.some((x) => x.id === t)) return t;
  } catch {
    /* storage blocked */
  }
  return "stats";
}

export function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("stats");
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    setSiteUrl(window.location.origin);
    setTab(readTab());
    const client = sb();
    void client.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = client.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setAdmin(null);
      return;
    }
    void sb()
      .rpc("is_admin")
      .then(({ data, error }) => setAdmin(!error && data === true));
  }, [session]);

  const [ready, setReady] = useState(false);
  const [firstRun, setFirstRun] = useState("");
  useEffect(() => {
    if (!admin) return;
    // This browser belongs to the owner: stop counting its visits.
    try {
      localStorage.setItem(IGNORE_KEY, "1");
    } catch {
      /* storage blocked */
    }
    seedIfEmpty()
      .then((r) => {
        if (r === "seeded") setFirstRun("ใส่ข้อมูลสินค้าและคอลเลกชันปัจจุบันลงฐานข้อมูลให้แล้ว แก้ไขได้เลย");
      })
      .catch((e: unknown) => setFirstRun(`ตั้งค่าข้อมูลเริ่มต้นไม่สำเร็จ: ${errText(e)}`))
      .finally(() => setReady(true));
  }, [admin]);

  const pick = (t: Tab) => {
    setTab(t);
    try {
      sessionStorage.setItem(TAB_KEY, t);
    } catch {
      /* storage blocked */
    }
  };

  if (session === undefined) return <Shell><p className="text-lavender">กำลังโหลด…</p></Shell>;
  if (!session) return <Shell><Login /></Shell>;
  if (admin === null) return <Shell><p className="text-lavender">กำลังตรวจสิทธิ์…</p></Shell>;
  if (!admin)
    return (
      <Shell>
        <div className="adm-card flex max-w-lg flex-col gap-4 p-6">
          <h1 className="adm-h2">บัญชีนี้ไม่มีสิทธิ์เข้าหลังบ้าน</h1>
          <p className="text-ivory/80">เข้าสู่ระบบด้วย {session.user.email} แล้ว แต่อีเมลนี้ไม่ได้อยู่ในรายชื่อผู้ดูแล</p>
          <button type="button" className="adm-btn self-start" onClick={() => void sb().auth.signOut()}>
            ออกจากระบบ
          </button>
        </div>
      </Shell>
    );

  return (
    <Shell
      bar={
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="hidden text-ivory/70 sm:inline">{session.user.email}</span>
          <a className="adm-btn-sm" href={`${siteUrl}/`} target="_blank" rel="noopener noreferrer">
            เปิดเว็บ ↗
          </a>
          <button type="button" className="adm-btn-sm" onClick={() => void sb().auth.signOut()}>
            ออกจากระบบ
          </button>
        </div>
      }
    >
      <nav className="adm-tabs mb-8 flex gap-2 overflow-x-auto pb-1" aria-label="เมนูหลังบ้าน">
        {tabs.map((t) => (
          <button key={t.id} type="button" className={`adm-tab ${tab === t.id ? "is-active" : ""}`} aria-current={tab === t.id ? "page" : undefined} onClick={() => pick(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>
      {firstRun ? (
        <p className={`${firstRun.startsWith("ตั้งค่า") ? "adm-error" : "adm-notice"} mb-6`} role="status">
          {firstRun}
        </p>
      ) : null}
      {!ready ? <p className="text-lavender">กำลังเตรียมข้อมูล…</p> : null}
      {ready && tab === "stats" ? <StatsAdmin /> : null}
      {ready && tab === "products" ? <ProductsAdmin siteUrl={siteUrl} /> : null}
      {ready && tab === "collections" ? <CollectionsAdmin siteUrl={siteUrl} /> : null}
      {ready && tab === "settings" ? <SettingsAdmin /> : null}
      <p className="adm-hint mt-12 border-t border-ivory/10 pt-4">
        แก้แล้วขึ้นบนเว็บทันทีเมื่อรีเฟรชหน้า · หน้าที่ Google อ่านจะอัปเดตรอบถัดไป (ทุก 6 ชั่วโมง)
      </p>
    </Shell>
  );
}

function Shell({ children, bar }: { children: React.ReactNode; bar?: React.ReactNode }) {
  return (
    <div className="adm min-h-dvh bg-night text-ivory" lang="th" data-site-lang="th">
      <header className="border-b border-gold/15 bg-navy/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="font-display tracking-[0.3em] text-gold">
            KHRAM <span className="ml-2 font-body text-sm tracking-normal text-ivory/70">หลังบ้าน</span>
          </p>
          {bar}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function send() {
    const e = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return setError("ใส่อีเมลให้ถูกต้อง");
    setState("sending");
    setError("");
    const { error: err } = await sb().auth.signInWithOtp({
      email: e,
      options: { emailRedirectTo: `${window.location.origin}/admin/`, shouldCreateUser: false },
    });
    if (err) {
      setState("idle");
      setError(
        /rate|seconds/i.test(err.message)
          ? "ขอลิงก์ถี่เกินไป รอสักครู่แล้วลองใหม่"
          : /signup|not allowed|not found/i.test(err.message)
            ? "อีเมลนี้ไม่มีสิทธิ์เข้าหลังบ้าน"
            : errText(err),
      );
      return;
    }
    setState("sent");
  }

  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col gap-5">
      <h1 className="adm-h2">เข้าสู่ระบบหลังบ้าน</h1>
      {state === "sent" ? (
        <div className="adm-card flex flex-col gap-3 p-5" role="status">
          <p className="text-ivory">ส่งลิงก์เข้าระบบไปที่ {email} แล้ว</p>
          <p className="text-sm text-ivory/75">เปิดอีเมลจาก Supabase แล้วกดลิงก์ในเครื่องนี้ (ลิงก์ใช้ได้ครั้งเดียว) ถ้าไม่เจอให้ดูในสแปม</p>
          <button type="button" className="adm-link self-start" onClick={() => setState("idle")}>
            ใช้อีเมลอื่น / ส่งใหม่
          </button>
        </div>
      ) : (
        <form
          className="adm-card flex flex-col gap-4 p-5"
          onSubmit={(ev) => {
            ev.preventDefault();
            void send();
          }}
        >
          <div className="adm-field">
            <label htmlFor="adm-email" className="adm-label">
              อีเมลผู้ดูแล
            </label>
            <input
              id="adm-email"
              className="adm-input"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder="khram.official@gmail.com"
            />
          </div>
          {error ? (
            <p className="adm-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="adm-btn adm-primary" disabled={state === "sending"}>
            {state === "sending" ? "กำลังส่ง…" : "ส่งลิงก์เข้าระบบทางอีเมล"}
          </button>
          <p className="adm-hint">ไม่ต้องใช้รหัสผ่าน ระบบจะส่งลิงก์ให้กดเข้าทางอีเมล</p>
        </form>
      )}
    </div>
  );
}
