namespace NodeJS {
  interface ProcessEnv {
    // Database
    DATABASE_URL: string;
    SHADOW_DATABASE_URL: string;

    // Redis / Dragonfly
    REDIS_CONNECTION_URL: string;

    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;

    // Cloudflare
    CLOUDFLARE_API_KEY: string;
    CLOUDFLARE_ACCOUNT_ID: string;

    // BunnyCDN
    BUNNY_CDN_API_KEY: string;
    BUNNY_STORAGE_ZONE: string;
    BUNNY_CDN_HOST: string;

    // Hyperbolic
    HYPERBOLIC_API_KEY: string;

    // LogSnag
    LOGSNAG_API_KEY: string;

    // Betterstack
    LOGTAIL_SOURCE_TOKEN: string;

    // Lemon Squeezy
    LEMONSQUEEZY_WEBHOOK_SECRET: string;
  }
}
