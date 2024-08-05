export const animeFullBodyPrompt = (details: {
  apperance: string;
  style: string;
  age: string;
  gender: string;
}) => `Based on the character: ${
  ["female", "male"].includes(details.gender?.toLowerCase())
    ? `${details.gender.toLowerCase()}, `
    : ""
}${details.age ? `age: ${details.age}, ` : ""}${details.apperance}. Stlye: ${
  details.style
}

Generate an prompt for Stable Diffusion model to create an anime style full body image of that character. It should be a full body pose with most of the body visible, include age.

Output should be only prompt and nothing else.
`;
