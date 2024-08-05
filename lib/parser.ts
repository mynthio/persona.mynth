// type PersonaResponseFields = {
//   name: string;
//   gender: string;
//   age: string;
//   occupation: string;
//   summary: string;
//   personalityTraits: string[];
//   interests: string[];
//   appearance: {
//     hairLength: string;
//     hairColor: string;
//     eyeColor: string;
//     skinColor: string;
//     bodyType: string;
//     facialFeatures: string;
//     clothingStyle: string;
//   };
//   background: string;
//   history: string;
//   characteristics: string;
// };

// export const parsePersonaResponse = (text: string): PersonaResponseFields => {
//   const profileData: Partial<PersonaResponseFields> = {};

//   const sections = [
//     { key: "name", regex: /1\.\s*name:\s*(.+)/ },
//     { key: "gender", regex: /2\.\s*gender:\s*(.+)/ },
//     { key: "age", regex: /3\.\s*age:\s*(.+)/ },
//     { key: "occupation", regex: /4\.\s*occupation:\s*(.+)/ },
//     { key: "summary", regex: /5\.\s*summary:\s*(.+)/ },
//     { key: "personalityTraits", regex: /6\.\s*personality\s*Traits:\s*(.+)/ },
//     { key: "interests", regex: /7\.\s*interests:\s*(.+)/ },
//     { key: "background", regex: /9\.\s*background:\s*(.+(?:\n.+)*)/ },
//     { key: "history", regex: /10\.\s*history:\s*(.+(?:\n.+)*)/ },
//     {
//       key: "characteristics",
//       regex: /11\.\s*characteristics:\s*(.+(?:\n.+)*)/,
//     },
//   ];

//   sections.forEach(({ key, regex }) => {
//     const match = text.match(regex);
//     if (match) {
//       if (key === "personalityTraits" || key === "interests") {
//         profileData[key as keyof PersonaResponseFields] = match[1]
//           .split(",")
//           .map((item) => item.trim());
//       } else {
//         profileData[key as keyof PersonaResponseFields] = match[1].trim();
//       }
//     }
//   });

//   // Parse appearance separately
//   const appearanceRegex = /8\.\s*appearance:\s*(.+(?:\n.+)*)/;
//   const appearanceMatch = text.match(appearanceRegex);
//   if (appearanceMatch) {
//     const appearanceText = appearanceMatch[1];
//     const appearance: PersonaResponseFields["appearance"] = {
//       hairLength: "",
//       hairColor: "",
//       eyeColor: "",
//       skinColor: "",
//       bodyType: "",
//       facialFeatures: "",
//       clothingStyle: "",
//     };

//     const appearanceFields = [
//       "hairLength",
//       "hairColor",
//       "eyeColor",
//       "skinColor",
//       "bodyType",
//       "facialFeatures",
//       "clothingStyle",
//     ];

//     appearanceFields.forEach((field) => {
//       const fieldRegex = new RegExp(`${field}:\\s*(.+)`);
//       const fieldMatch = appearanceText.match(fieldRegex);
//       if (fieldMatch) {
//         appearance[field as keyof typeof appearance] = fieldMatch[1].trim();
//       }
//     });

//     profileData.appearance = appearance;
//   }

//   return profileData as PersonaResponseFields;
// };
type PersonaResponseFields = {
  name: string;
  gender: string;
  age: string;
  occupation: string;
  summary: string;
  personalityTraits: string;
  interests: string;
  appearance: string;
  style: string;
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
    "appearance",
    "style",
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
