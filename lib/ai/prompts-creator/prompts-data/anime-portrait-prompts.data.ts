export const animePortraitPrompt = (details: {
  apperance: string;
  age: string;
  gender: string;
}) => `Based on the character: ${
  ["female", "male"].includes(details.gender?.toLowerCase())
    ? `${details.gender.toLowerCase()}, `
    : ""
}${details.age ? `age: ${details.age}, ` : ""}${details.apperance}

Generate an prompt for Stable Diffusion model to create an anime style portait of that character. It should be portrait with visible head and shoulders only, include age.

Output should be only prompt and nothing else.
`;
