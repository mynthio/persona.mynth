export const realisticPortraitPrompt = (details: {
  apperance: string;
  age: string;
  gender: string;
}) => `Based on the character: ${
  ["female", "male"].includes(details.gender?.toLowerCase())
    ? `${details.gender.toLowerCase()}, `
    : ""
}${details.age ? `age: ${details.age}, ` : ""}${details.apperance}

Generate an prompt for Stable Diffusion model to create an photorealistic portait of that character. It should be photorealistic portrait, blurred background or no background, visible head and shoulders only, include age.

Use provided prompts as reference on how to create best quality prompts:
- hyperrealistic, 8K, 1woman, (closed eyes, facing viewer, lying down, gothic, black lips, roses, dark night), ([closeup to her lips, mariah carey], :0.85)
- (best_quality),(ultra_detailed), photo of beautiful 18-year-old girl, pastel hair, freckles sexy, beautiful, close up, young, DSLR, 8k, natural skin, textured skin
- Photo of a corporate employee, office in the background, smiling, wearing a suit, highly detailed, DSLR
- Ciri, redhead, Close portrait, (lightroom:1.13), soft light, (natural skin texture:1.2), (hyperrealism:1.2), sharp focus, focused
- (best_quality),(ultra_detailed), photo of a beautiful 18-year-old girl, pastel hair, freckles sexy, beautiful, close up, young, DSLR, 8k, natural skin, textured skin
- Closeup portrait, cute, 1girl, choker, smiling
- Portrait of a war solider, nervous and anxious look on face, holding an AR15, in the jungle
- (redhead|ginger hair), blue eyes, curly hair, smiling, fit, slim, in nightclub, best quality, highly detailed, intricate details, happy
- photo of a Danish woman wearing a black dress, black rim glasses, age 25, cinematic lighting, dark theme, bokeh
- high quality, ultrarealistic, cinematic, fireworks, 1man, 1woman, selfie
- (1girl),light blue hair,beige shirt,(red makeup:1.2),(Ancient makeup),(Substance:1.2),(Stars:1.4),directed by Shane MacMullan,neon pop art style,photos taken with ektachrome,(gothic style dark and moody tones),softbox lighting,instax film,stunning photo of a beautiful woman,color film photo,FilmG,8k,original photo,(Film Grain:1),(Floating Dust Grain:1.2),Award Winning photo,24mm,focus,spotlight,rim light,dark,dim,low key,deep shadow,fog,medium view,

Output should be only prompt and nothing else.
`;
