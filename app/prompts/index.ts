import { CreatorPrompt } from "@/schemas/create-prompt.schema";

export const textPrompt = (
  text: string
) => `You are an AI assistant tasked with creating detailed persona profiles based on brief character descriptions. Given a text description of a character, generate a comprehensive persona profile. Include all the following fields in such format:
  
  name: Character's full name
  gender: Character's gender
  age: Character's age (as a string, for example: "30" or "20-24")
  occupation: Character's job or primary role
  summary: A brief, one-sentence summary of the character
  personalityTraits: Comma separated list of 3-5 key personality traits
  interests: Comma separated list of 3-5 main interests or hobbies
  culturalBackground: Character's cultural or ethnic background
  appearance: A paragraph describing the character's physicalappearance
  appearancePrompt: a prompt passed to text-to-image model to generate the image of the persona portrait
  background: A paragraph about the character's upbringing andformative experiences
  history: A paragraph detailing key events in the character's life
  characteristics: A paragraph describing the character's behavior,mannerisms, and notable qualities
  
  Ensure that all fields are filled out based on the given description, using creative inference where necessary to provide a complete and consistent persona. If any information is not explicitly provided in the original description, use your best judgment to create plausible details that fit the overall character concept.
  
  Character Description:
  ${text}
  
  Output should be text, without markdown formatting. Each section should be in new line. Use format <section name>:<content>`;

// export const creatorPrompt = (input: CreatorPrompt) => {
//   const getRandomGender = () =>
//     ["male", "female", "other"][Math.floor(Math.random() * 3)];
//   const gender = input.gender === "random" ? getRandomGender() : input.gender;

//   const occupations = input.occupations?.map((o) => o.occupation) || [];
//   if (input.occupationCustom) occupations.push(input.occupationCustom);

//   const traits = input.personalityTraits?.map((t) => t.trait) || [];
//   if (input.personalityTraitsCustom) traits.push(input.personalityTraitsCustom);

//   const hobbies = input.hobbies?.map((h) => h.hobby) || [];
//   if (input.hobbiesCustom) hobbies.push(input.hobbiesCustom);

//   const relationships = input.relationship?.map((r) => r.relationship) || [];
//   if (input.relationshipCustom) relationships.push(input.relationshipCustom);

//   return `Generate a character with the following details:
// ${input.style ? `Style: ${input.style}` : ""}
// ${input.personaName ? `Name: ${input.personaName}` : "Generate a full name"}
// ${gender ? `Gender: ${gender}` : "Generate a gender"}
// ${input.age ? `Age: ${input.age}` : "Generate an age"}
// ${
//   occupations.length > 0
//     ? `Occupation: ${occupations.join(", ")}`
//     : "Generate an occupation"
// }
// Personality Traits: ${
//     traits.length > 0 ? traits.join(", ") : "Generate 3-5 personality traits"
//   }
// Interests: ${
//     hobbies.length > 0
//       ? hobbies.join(", ")
//       : "Generate 3-5 interests or hobbies"
//   }
// Relationships: ${
//     relationships.length > 0
//       ? relationships.join(", ")
//       : "Generate key relationships"
//   }

// Based on these details, please provide the following:

// 1. name: Character's full name
// 2. gender: Character's gender
// 3. age: Character's age (as a string, for example: "30" or "20-24")
// 4. occupation: Character's job or primary role
// 5. summary: A brief, one-sentence summary of the character
// 6. personalityTraits: Comma separated list of 3-5 key personality traits
// 7. interests: Comma separated list of 3-5 main interests or hobbies
// 8. appearance: Provide the following details:
//    - hairLength: Length of hair
//    - hairColor: Color of hair
//    - eyeColor: Color of eyes
//    - skinColor: Color of skin
//    - bodyType: Type of body build
//    - facialFeatures: Notable facial features
//    - clothingStyle: Typical style of clothing
// 9. background: A paragraph about the character's upbringing and formative experiences
// 10. history: A paragraph detailing key events in the character's life
// 11. characteristics: A paragraph describing the character's behavior, mannerisms, and notable qualities

// Please format your response exactly as requested, using the numbers and labels provided.`;
// };

export const creatorPrompt = (input: CreatorPrompt) => {
  return `You are an AI assistant tasked with creating detailed realistic style persona profiles based on user input. Given a description of a character, generate a comprehensive and realistic persona profile. Include all the following fields in such format:

  name: Character's full name
  gender: Character's gender
  age: Character's age (as a string, for example: "30" or "20-24")
  occupation: Character's job or primary role
  summary: A brief, one-sentence summary of the character
  personalityTraits: Comma separated list of 3-5 key personality traits
  interests: Comma separated list of 3-5 main interests or hobbies
  appearance: A paragraph describing the character's physical appearance
  background: A paragraph about the character's uprising and formative experiences
  history: A paragraph detailing key events in the character's life
  characteristics: A paragraph describing the character's behavior,mannerisms, and notable qualities

  Ensure that all fields are filled out based on the given description, using creative inference where necessary to provide a complete and consistent persona. If any information is not explicitly provided in the original description, use your best judgment to create plausible details that fit the overall character concept.

  Persona style should be realistic, like real person profile.

  Character Description:
  ${input.personaName ? `Name: ${input.personaName}` : ""}
  ${input.gender ? `Gender: ${input.gender}` : ""}
  ${input.age ? `Age: ${input.age}` : ""}
  ${
    input.occupations && input.occupations.length > 0
      ? `Occupations: ${input.occupations.map((o) => o.occupation).join(", ")}${
          input.occupationCustom ? `, ${input.occupationCustom}` : ""
        }`
      : input.occupationCustom
  }
  ${
    input.personalityTraits
      ? `Personality Traits: ${input.personalityTraits
          .map((p) => p.trait)
          .join(",")}${
          input.personalityTraitsCustom
            ? `, ${input.personalityTraitsCustom}`
            : ""
        }`
      : input.personalityTraitsCustom
  }
  ${input.apperance ? `Appearance: ${JSON.stringify(input.apperance)}` : ""}
  ${
    input.hobbies
      ? `Hobbies: ${input.hobbies.map((h) => h.hobby).join(", ")}${
          input.hobbiesCustom ? `, ${input.hobbiesCustom}` : ""
        }`
      : input.hobbiesCustom
  }
  ${
    input.relationship
      ? `Relationship: ${input.relationship
          .map((r) => r.relationship)
          .join(", ")}${
          input.relationshipCustom ? `, ${input.relationshipCustom}` : ""
        }`
      : input.relationshipCustom
  }

  Output should be text, without markdown formatting. Each section should be in new line. Use format <section name>:<content>`;
};

export const imagePrompt = (
  appearance: string,
  additional?: {
    apperanceDetails?: CreatorPrompt["apperance"] | null;
    age?: string | null;
    gender?: string | null;
  }
) => {
  return `You are a helpful assistantYour AI assistant that generates prompts for text to image generation models. 

The model you're creating prompt for is SD XL 1.0

Example prompts:

1. Brunette pilot girl in a snowstorm, full body, moody lighting, intricate details, depth of field, outdoors, Fujifilm XT3, RAW, 8K UHD, film grain, Unreal Engine 5, ray tracing.

2. closeup portrait of 1 Persian princess, royal clothing, makeup, jewelry, wind-blown long hair, symmetric, desert, ((sands, dusty and foggy, sand storm, winds)) bokeh, depth of field, centered

3. Psychedelic model looking at the viewer, award-winning portrait photography, 1woman, focus face, vivid, with fractals in the background, alien woman, detailed, third eye, glowing eyes, fractal pattern, a light smile

4. (fractal crystal skin:1.1) with( ice crown:1.4) woman, white crystal skin, (fantasy:1.3), (Anna Dittmann:1.3)

5. retro style, 90s photo of a captivating girl having lunch in a restaurant, a bustling metropolis, neon barrettes, enigmatic setting, retro

7. bokeh, bokeh effect, 1girl, upper body, portrait

8. (fluorescent colors:1.4),(translucent:1.4),(retro filters:1.4), (fantasy:1.4), 1girl, (lying:1.3), ethereal soft fluffy, soft landscape forest snowavatar, Pastel pink sky

9. fashion photoshoot of a blonde man wearing sunglasses, a colorful costume, highly stylistic

Character Description: ${appearance}
${
  additional &&
  `Emphasize the following details:
  ${additional.gender ? `Gender: ${additional.gender}` : ""}
  ${additional.age ? `Age: ${additional.age}` : ""}
  ${
    additional.apperanceDetails
      ? `Appearance: ${JSON.stringify(additional.apperanceDetails)}`
      : ""
  }
`
}
Based on provided example prompts, and character description provided by user, generate a prompt.

Please do not add anything else than prompt to the message. No text from you!`;
};
