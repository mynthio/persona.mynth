namespace NodeJS {
  interface ProcessEnv {
    // Database
    DATABASE_URL: string;
    SHADOW_DATABASE_URL: string;

    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;

    // Cloudflare
    CLOUDFLARE_API_KEY: string;
    CLOUDFLARE_ACCOUNT_ID: string;

    // BunnyCDN
    BUNNY_CDN_API_KEY: string;
  }
}
