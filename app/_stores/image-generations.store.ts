import { create } from "zustand";

interface ImageGenerationState {
  data: {
    eventId: string;
    status: string;
    imageUrl?: string;
    id?: string;
    personaId: string;
  }[];
  addImageGeneration: (imageGeneration: {
    status: string;
    imageUrl?: string;
    id?: string;
    eventId: string;
    personaId: string;
  }) => void;
  updateImageGeneration: (
    eventId: string,
    update: {
      status: string;
      imageUrl?: string;
      id?: string;
    }
  ) => void;
}

export const useImageGenerations = create<ImageGenerationState>()((set) => ({
  data: [],
  addImageGeneration: (imageGeneration: {
    status: string;
    imageUrl?: string;
    id?: string;
    eventId: string;
    personaId: string;
  }) => {
    set((state) => ({
      data: [...state.data, imageGeneration],
    }));
  },
  updateImageGeneration: (
    eventId: string,
    update: {
      status: string;
      imageUrl?: string;
      id?: string;
    }
  ) => {
    set((state) => ({
      data: state.data.map((imageGeneration) =>
        imageGeneration.eventId === eventId
          ? {
              ...imageGeneration,
              ...update,
            }
          : imageGeneration
      ),
    }));
  },
}));
