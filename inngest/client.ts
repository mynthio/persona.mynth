import { Inngest, InngestMiddleware } from "inngest";
import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";
import { createVertex } from "@ai-sdk/google-vertex";

// make Prisma available in the Inngest functions
const prismaMiddleware = new InngestMiddleware({
  name: "Prisma Middleware",
  init() {
    const prisma = new PrismaClient();

    return {
      onFunctionRun(ctx) {
        return {
          transformInput(ctx) {
            return {
              // Anything passed via `ctx` will be merged with the function's arguments
              ctx: {
                prisma,
              },
            };
          },
        };
      },
    };
  },
});

// make Prisma available in the Inngest functions
const redisMiddleware = new InngestMiddleware({
  name: "Cache Client Init Middleware",
  init() {
    const redis = new Redis();

    return {
      onFunctionRun(ctx) {
        return {
          transformInput(ctx) {
            return {
              // Anything passed via `ctx` will be merged with the function's arguments
              ctx: {
                redis,
              },
            };
          },
        };
      },
    };
  },
});

const aiMiddleware = new InngestMiddleware({
  name: "AI Middleware",
  init() {
    const vertex = createVertex({
      project: "persona-mynth", // optional
      location: "us-central1", // optional
    });

    return {
      onFunctionRun(ctx) {
        return {
          transformInput(ctx) {
            return {
              // Anything passed via `ctx` will be merged with the function's arguments
              ctx: {
                vertex,
              },
            };
          },
        };
      },
    };
  },
});

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "persona-mynth",
  middleware: [prismaMiddleware, redisMiddleware],
});
