export const realisticFullBodyPrompt = (details: {
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

Generate an prompt for Stable Diffusion model to create an photorealistic image of that character. It should be photorealistic image capturing full body, include age. Add an action/dynamic to prompt, emphasize full body in prompt using triple brackets (((full body))), add details about lower body/clothes and shoes. Prompt should be straight forward, comma separated list of keywords, not too long.

Use provided prompts as reference on how to create best quality prompts:
- professional full body shot of a Norwegian girl wearing only a two-piece swimsuit (beach), (dune), long hair, perfect female anatomy, (beautiful abs), beautiful detailed face, beautiful symmetrical face, cute natural makeup, photorealistic, hyperrealistic, realistic, extremely detailed, sharp focus, cinematic light, rays of the gods, intense sunset, film grain, professional color grading, digital art, very detailed, depth of field, f/1. 4, 50mm, 8k. detailed and realistic portrait of a woman with a few freckles, round eyes and short messy hair shot outside,staring at camera, chapped lips, soft natural lighting, portrait photography, magical photography, dramatic lighting, photo realism, ultra-detailed,
- katy perry, full body portrait, as a queen, sitting on a throne, digital art by artgerm
- (((Full-length portrait))), An American Classic Girl wearing a short skirt and red Heel Sandal, , with Fair Skin standing on rock, 20 Years Old,Witchcraft dress, interior of a Roman castle,(colorful),(finely detailed beautiful eyes and detailed face),Cute, Instagram Model,long black_hair, colorful hair, warm, Posing , Ancient American ,Carter,AanyaaSanaya,16k Ultra Highres, (((Full-length landscape shot)))(((Full shot))),(((Full-length portrait))),
- full body, young beautiful woman, best quality, ultra high res, (photorealistic:1.4)
- full body shot at distance a (natalie portman:0.8) (emma watson:0.7) girl, (frightened:1.7), ([(grey:0.9) | (purple:1.9) | pink | blue | red | (purple:1.1) | black | (red:1.2) | pink]:1.3) hair, (long wild hair:1.4), (freckles on face:1.3), pearcing (red punk jacket:1.3), black t-shirt landscape of ocean and cliffs on background
- Full body portrait of a car model, photorealistic, highly detailed, beautiful eyes
- A graceful full-body image of a ballerina mid-pirouette on a grand stage, illuminated by a bright spotlight, with a flowing tutu and elegant ballet slippers.
- A highly detailed full-body depiction of a futuristic robot with sleek metallic limbs and glowing blue eyes, standing in a high-tech laboratory filled with advanced machinery and holographic displays.
- A rugged full-body illustration of a cowboy in classic Wild West attire, complete with a hat, boots, and a lasso, standing beside his trusty horse in a dusty desert landscape.
- A charismatic full-body portrait of a pirate captain with a tricorn hat and a long coat, standing on the deck of a pirate ship with a treasure chest and the ocean in the background.
- A regal full-body portrait of a medieval queen in a luxurious royal gown, standing with grace in a grand hall adorned with tapestries and chandeliers.
- A full-body image of a cyberpunk hacker in a neon-lit alley, wearing a hooded jacket with glowing circuitry, typing on a futuristic handheld device.

Output should be only prompt and nothing else.
`;
