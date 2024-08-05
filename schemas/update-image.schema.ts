import { boolean, Infer, object, optional, string } from "superstruct";

export const UpdateImageSchema = object({
  imageId: string(),
  public: optional(boolean()),
});

export type UpdateImageData = Infer<typeof UpdateImageSchema>;
