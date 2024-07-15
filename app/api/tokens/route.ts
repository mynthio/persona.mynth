import { getRemainingTokens } from "@/lib/tokens";
import { redis } from "@/redis/client";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    return Response.json({ usedTokens: 0, dailyTokens: 0 });
  }

  const remainingTokens = await getRemainingTokens();

  return Response.json({
    remainingTokens,
    dailyTokens: Number(sessionClaims?.["daily-tokens"] ?? 100),
  });
}
