"use server";

import "server-only";

import { logger } from "@/lib/logger";
import { logsnag } from "@/lib/logsnag.server";
import { prisma } from "@/prisma/client";
import { CreateChatData, CreateChatSchema } from "@/schemas/create-chat.schema";
import { currentUser } from "@clerk/nextjs/server";
import { assert } from "superstruct";

export const createChatAction = async (data: CreateChatData) => {
  const user = await currentUser();
  if (!user) throw new Error("User not logged in");

  assert(data, CreateChatSchema);

  const persona = await prisma.persona.findUnique({
    where: {
      id: data.personaId,
      creatorId: user.id,
    },
  });

  if (!persona) throw new Error("Persona not found");

  const userCharacter = {
    name: (data.userName?.length || 0) > 0 ? data.userName : user.username,
    character: data.userCharacter,
  };

  const systemMessage = `You're playing a role of ${
    persona.name
  } in roleplay chat with ${
    userCharacter.name
  }. Behave like a provided character only. Be creative, move story forward, answer questions, make it like a real experience, talk scenes. Write only as character, don't write as user. Dont't repeat yourself. Don't prefix your text with character name etc.
    
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
Characteristics: ${persona.characteristics}

User character:
Name: ${userCharacter.name}
Character: ${userCharacter.character}

Scenario: ${
    data.scenario
      ? data.scenario
      : "Scenario not provided. Be creative. Come up with something based on user first messages."
  }`;

  const chat = await prisma.chat
    .create({
      data: {
        type: "chat",
        personaId: data.personaId,
        name: data.name,
        model: data.model,
        scenario: data.scenario,
        userId: user.id,
        userCharacter: JSON.stringify({
          name: data.userName,
          character: data.userCharacter,
        }),
        messages: {
          create: {
            role: "system",
            content: "",
            versions: {
              create: {
                content: systemMessage,
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
    })
    .catch((e) => {
      logger.error(e);
      throw new Error("Failed to create chat");
    });

  await logsnag.track({
    channel: "chats",
    event: "New chat",
    user_id: user.id,
    icon: "💬",
    tags: {
      model: data.model,
      persona: data.personaId,
    },
  });

  return chat;
};
