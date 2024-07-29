"use server";

import "server-only";

import { prisma } from "@/prisma/client";
import {
  CreatePrompt,
  CreatePromptSchema,
} from "@/schemas/create-prompt.schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { assert } from "superstruct";
import { logger } from "@/lib/logger";
import { creatorPrompt, imagePrompt } from "../prompts";
import { parsePersonaResponse } from "@/lib/parser";
import { TextGenerationModelFactory } from "@/lib/ai/text-generation-models/text-generation-model-factory";
import { TextGenerationModelsEnum } from "@/lib/ai/text-generation-models/enums/text-generation-models.enum";

export const createPromptAction = async (data: CreatePrompt) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  assert(data, CreatePromptSchema);

  // logger.debug("Prompt", {
  //   prompt: JSON.stringify(creatorPrompt(data as any)),
  // });

  // const model = TextGenerationModelFactory.create(
  //   TextGenerationModelsEnum.MetaLlama3_70bInstruct
  // );

  // let response = await model.generateText(creatorPrompt(data as any));

  // const output = await parsePersonaResponse(response);

  // logger.debug("Output", output);

  // const imgPrompt = imagePrompt(output.appearance);

  // logger.debug("Image Prompt", { imgPrompt });

  // const imageResponse = await model.generateText(imgPrompt);

  // logger.debug("Image Response", { imageResponse });

  // return;

  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");

  const { id } = await prisma.personaPrompt.create({
    data: {
      input: data,
      creator: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return {
    personaPromptId: id,
  };
};
