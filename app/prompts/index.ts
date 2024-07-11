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
  background: A paragraph about the character's upbringing andformative experiences
  history: A paragraph detailing key events in the character's life
  characteristics: A paragraph describing the character's behavior,mannerisms, and notable qualities
  
  Ensure that all fields are filled out based on the given description, using creative inference where necessary to provide a complete and consistent persona. If any information is not explicitly provided in the original description, use your best judgment to create plausible details that fit the overall character concept.
  
  Character Description:
  ${text}
  
  Output should be text, without markdown formatting. Each section should be in new line. Use format <section name>:<content>`;
