import { ImagePromptContentTypeEnum } from "../enums/image-prompt-content-type.enum";
import { ImagePromptPortraitDynamicsEnum } from "../enums/image-prompt-portait-dynamics.enum";
import { ImagePromptPortraitEnum } from "../enums/image-prompt-portrait.enum";
import { ImagePromptStyleEnum } from "../enums/image-prompt-style.enum";

type Settings = {
  contentType: ImagePromptContentTypeEnum;
  style: ImagePromptStyleEnum;
  portrait: ImagePromptPortraitEnum;
  dynamics: ImagePromptPortraitDynamicsEnum;
};

export class ImagePromptCreator {}
