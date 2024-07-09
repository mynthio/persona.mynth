namespace NodeJS {
  interface ProcessEnv {
    // Database
    DATABASE_URL: string;
    SHADOW_DATABASE_URL: string;

    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
  }
}
