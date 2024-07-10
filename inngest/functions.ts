import { assert } from "superstruct";
import { inngest } from "./client";
import { GeneratePersonaEventData } from "@/schemas/generate-persona-event-data.schema";

const USER_LIMIT = 30;

export const generatePersonas = inngest.createFunction(
  { id: "generate-personas" },
  { event: "app/generate-personas.sent" },

  async ({ event, step, prisma, redis, runId }) => {
    /**
     * At this point rate limiting should be already verified, before sending event
     */
    const data = event.data;
    assert(data, GeneratePersonaEventData);

    console.log("messageSent function running", { event, step });
  }
);
