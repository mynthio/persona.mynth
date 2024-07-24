import React from "react";

export const PersonaContext = React.createContext<{
  mutate: (args: any) => any;
} | null>(null);
