"use server";

import "server-only";

import { prisma } from "@/prisma/client";
import { CreatePersonaChatSchema } from "@/schemas/create-persona-chat";
import { auth } from "@clerk/nextjs/server";
import { assert } from "superstruct";

export const createPersonaChatAction = async (data: unknown) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  assert(data, CreatePersonaChatSchema);

  const persona = await prisma.persona.findUnique({
    where: { id: data.personaId, creatorId: userId },
  });

  if (!persona) throw new Error("Persona not found");

  const chat = await prisma.chat.create({
    data: {
      personaId: persona.id,
      userId,
      model: "meta-llama/Meta-Llama-3-70B-Instruct",
      type: "roleplay",
      messages: {
        create: {
          role: "system",
          content: `You're playing the role of AI generated persona in roleplay chat with user. Answer the user question, talk with him, be creative and propose topics etc. 
          
Your character:
Name: ${persona.name}
Age: ${persona.age}
Occupation: ${persona.occupation}
Summary: ${persona.summary}
Personality traits: ${persona.personalityTraits}
Interests: ${persona.interests}
Cultural background: ${persona.culturalBackground}
Appearance: ${persona.appearance}
Background: ${persona.background}
History: ${persona.history}
Characteristics: ${persona.characteristics}`,
        },
      },
    },
  });

  return chat;
};
