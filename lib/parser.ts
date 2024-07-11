type PersonaResponseFields = {
  name: string;
  gender: string;
  age: string;
  occupation: string;
  summary: string;
  personalityTraits: string;
  interests: string;
  culturalBackground: string;
  appearance: string;
  background: string;
  history: string;
  characteristics: string;
};

export const parsePersonaResponse = (text: string): PersonaResponseFields => {
  const profileData: Partial<PersonaResponseFields> = {};

  const sections = [
    "name",
    "gender",
    "age",
    "occupation",
    "summary",
    "personalityTraits",
    "interests",
    "culturalBackground",
    "appearance",
    "background",
    "history",
    "characteristics",
  ];

  sections.forEach((section) => {
    const regex = new RegExp(`${section}:\\s*([^\\n]+)`, "i");
    const match = text.match(regex);
    if (match) {
      profileData[section as keyof PersonaResponseFields] = match[1].trim();
    }
  });

  return profileData as PersonaResponseFields;
};
