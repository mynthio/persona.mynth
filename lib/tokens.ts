import "server-only";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redis } from "@/redis/client";

function getExpirationSeconds() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(24, 0, 0, 0);
  return Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
}

export async function checkAndUpdateUserTokens(cost: number) {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Get the user's max tokens from Clerk
  const dailyTokens = Number(sessionClaims?.["daily-tokens"] || 100);

  const dateKey = new Date().toISOString().split("T")[0]; // e.g., "2024-07-15"
  const key = `user:${userId}:tokens:${dateKey}`;

  let usedTokensEntry = await redis.get(key);
  let usedTokens = usedTokensEntry ? parseInt(usedTokensEntry) : 0;

  if (usedTokens + cost > dailyTokens) {
    return { canGenerate: false, remainingTokens: dailyTokens - usedTokens };
  }

  if (usedTokensEntry === null) {
    // First use of the day
    const expirationSeconds = getExpirationSeconds();
    await redis.set(key, cost.toString(), "EX", expirationSeconds);
  } else {
    await redis.incrby(key, cost);
  }

  const newUsedTokens = usedTokens + cost;
  return { canGenerate: true, remainingTokens: dailyTokens - newUsedTokens };
}

export async function getRemainingTokens() {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const dateKey = new Date().toISOString().split("T")[0]; // e.g., "2024-07-15"
  const key = `user:${userId}:tokens:${dateKey}`;

  const dailyTokens = Number(sessionClaims?.["daily-tokens"] || 100);

  const usedTokensEntry = await redis.get(key).then((v) => parseInt(v) || 0);
  return dailyTokens - usedTokensEntry;
}
