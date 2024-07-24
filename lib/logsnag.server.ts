import "server-only";

import { LogSnag } from "@logsnag/next/server";

export const logsnag = new LogSnag({
  token: process.env.LOGSNAG_API_KEY,
  project: "persona",
  disableTracking: process.env.NODE_ENV === "development",
});
