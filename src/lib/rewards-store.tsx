import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Tier = "Member" | "Silver" | "Gold";

export type RewardsActivity = {
  id: string;
  type: "earned" | "redeemed" | "referral" | "bonus";
  points: number; // positive number (sign implied by type)
  description: string;
  date: string; // ISO
};

type RewardsCtx = {
  balance: number;        // spendable points
  lifetime: number;       // never decreases — drives tier
  tier: Tier;
  multiplier: number;
  nextTier: Tier | null;
  pointsToNext: number;
  tierProgress: number;   // 0–1
  referralCode: string;
  activity: RewardsActivity[];
  // actions
  redeem: (points: number) => { ok: boolean; dollars: number };
  award: (dollarsSpent: number) => number; // returns points earned
  pointsToDollars: (p: number) => number;
  maxRedeemable: (orderSubtotal: number) => number;
};

const Ctx = createContext<RewardsCtx | null>(null);
const KEY = "flashtrends-rewards-v1";

const SILVER_AT = 500;
const GOLD_AT = 1500;
const MIN_REDEEM = 200;
const POINTS_PER_DOLLAR = 50; // 50 pts = $1

function computeTier(lifetime: number): { tier: Tier; multiplier: number; nextTier: Tier | null; pointsToNext: number; tierProgress: number } {
  if (lifetime >= GOLD_AT) {
    return { tier: "Gold", multiplier: 1.5, nextTier: null, pointsToNext: 0, tierProgress: 1 };
  }
  if (lifetime >= SILVER_AT) {
    return {
      tier: "Silver",
      multiplier: 1.25,
      nextTier: "Gold",
      pointsToNext: GOLD_AT - lifetime,
      tierProgress: (lifetime - SILVER_AT) / (GOLD_AT - SILVER_AT),
    };
  }
  return {
    tier: "Member",
    multiplier: 1,
    nextTier: "Silver",
    pointsToNext: SILVER_AT - lifetime,
    tierProgress: lifetime / SILVER_AT,
  };
}

// Seed for demo (Maya Okafor) — ~1,220 lifetime pts → Silver
const SEED: { balance: number; lifetime: number; referralCode: string; activity: RewardsActivity[] } = {
  balance: 1020,
  lifetime: 1220,
  referralCode: "MAYA-FT15",
  activity: [
    { id: "a1", type: "earned",   points: 185, description: "Order AT-82910 · Heavyweight Linen Shirt", date: "2026-03-02" },
    { id: "a2", type: "earned",   points: 861, description: "Order AT-83012 · Cashmere Overcoat",      date: "2026-03-18" },
    { id: "a3", type: "redeemed", points: 200, description: "$4 off — Order AT-83110",                 date: "2026-03-22" },
    { id: "a4", type: "earned",   points: 174, description: "Order AT-82711 · Stonewashed Linen Set",  date: "2026-02-20" },
    { id: "a5", type: "bonus",    points: 100, description: "Welcome bonus — joined FlashTrends Rewards", date: "2023-11-04" },
  ],
};

export function RewardsProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(SEED.balance);
  const [lifetime, setLifetime] = useState<number>(SEED.lifetime);
  const [referralCode] = useState<string>(SEED.referralCode);
  const [activity, setActivity] = useState<RewardsActivity[]>(SEED.activity);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (typeof p.balance === "number") setBalance(p.balance);
        if (typeof p.lifetime === "number") setLifetime(p.lifetime);
        if (Array.isArray(p.activity)) setActivity(p.activity);
      }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(KEY, JSON.stringify({ balance, lifetime, activity })); } catch {}
  }, [balance, lifetime, activity, hydrated]);

  const value = useMemo<RewardsCtx>(() => {
    const t = computeTier(lifetime);
    return {
      balance,
      lifetime,
      ...t,
      referralCode,
      activity,
      pointsToDollars: (p) => +(p / POINTS_PER_DOLLAR).toFixed(2),
      maxRedeemable: (subtotal) => {
        const byBalance = Math.floor(balance / MIN_REDEEM) * MIN_REDEEM; // multiples of 200? No — cap at full balance
        const capped = Math.min(balance, Math.floor(subtotal * POINTS_PER_DOLLAR));
        return Math.max(0, capped - (capped % 1));
        void byBalance;
      },
      redeem: (points) => {
        if (points < MIN_REDEEM) return { ok: false, dollars: 0 };
        if (points > balance) return { ok: false, dollars: 0 };
        const dollars = +(points / POINTS_PER_DOLLAR).toFixed(2);
        setBalance((b) => b - points);
        setActivity((a) => [
          { id: `r${Date.now()}`, type: "redeemed", points, description: `$${dollars.toFixed(2)} off — redeemed at checkout`, date: new Date().toISOString().slice(0, 10) },
          ...a,
        ]);
        return { ok: true, dollars };
      },
      award: (dollarsSpent) => {
        const earned = Math.round(dollarsSpent * t.multiplier);
        if (earned <= 0) return 0;
        setBalance((b) => b + earned);
        setLifetime((l) => l + earned);
        setActivity((a) => [
          { id: `e${Date.now()}`, type: "earned", points: earned, description: `Order · earned at ${t.multiplier}× (${t.tier})`, date: new Date().toISOString().slice(0, 10) },
          ...a,
        ]);
        return earned;
      },
    };
  }, [balance, lifetime, referralCode, activity]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRewards() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useRewards outside provider");
  return v;
}

export const REWARDS_CONSTANTS = { MIN_REDEEM, POINTS_PER_DOLLAR, SILVER_AT, GOLD_AT };
