import { Infer, object, string } from "superstruct";

export const DeleteImageSchema = object({
  imageId: string(),
});

export type DeleteImageInput = Infer<typeof DeleteImageSchema>;
