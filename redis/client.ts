import "server-only";

import { Redis } from "ioredis";

const redisClientSingleton = () => {
  return new Redis(process.env.REDIS_CONNECTION_URL);
};

declare const globalThis: {
  redisGlobal: ReturnType<typeof redisClientSingleton>;
} & typeof global;

const redis = globalThis.redisGlobal ?? redisClientSingleton();

export { redis };

if (process.env.NODE_ENV !== "production") globalThis.redisGlobal = redis;
