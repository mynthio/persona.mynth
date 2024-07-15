// Generated by Xata Codegen 0.29.5. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "Comment",
    columns: [
      {
        name: "content",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "createdAt",
        type: "timestamp(3) without time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: null,
      },
      {
        name: "personaId",
        type: "link",
        link: { table: "Persona" },
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "updatedAt",
        type: "timestamp(3) without time zone",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "userId",
        type: "link",
        link: { table: "User" },
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "xata_createdat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
      },
      {
        name: "xata_updatedat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
      },
    ],
  },
  {
    name: "Image",
    columns: [
      {
        name: "id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: null,
      },
      {
        name: "personaId",
        type: "link",
        link: { table: "Persona" },
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "prompt",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: null,
      },
      {
        name: "xata_createdat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
      },
      {
        name: "xata_updatedat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
      },
    ],
  },
  {
    name: "Persona",
    columns: [
      {
        name: "age",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "appearance",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "background",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "characteristics",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "consistencyId",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: null,
      },
      {
        name: "createdAt",
        type: "timestamp(3) without time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "creatorId",
        type: "link",
        link: { table: "User" },
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "culturalBackground",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "fullDescription",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: null,
      },
      {
        name: "gender",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "history",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: null,
      },
      {
        name: "interests",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "isNsfw",
        type: "bool",
        notNull: true,
        unique: false,
        defaultValue: "false",
      },
      {
        name: "likesCount",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
      },
      {
        name: "mainImageUrl",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: null,
      },
      {
        name: "name",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "occupation",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "personalityTraits",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "promptId",
        type: "link",
        link: { table: "PersonaPrompt" },
        notNull: false,
        unique: false,
        defaultValue: null,
      },
      {
        name: "published",
        type: "bool",
        notNull: true,
        unique: false,
        defaultValue: "false",
      },
      {
        name: "publishedAt",
        type: "timestamp(3) without time zone",
        notNull: false,
        unique: false,
        defaultValue: null,
      },
      {
        name: "summary",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "tags",
        type: "multiple",
        notNull: false,
        unique: false,
        defaultValue: null,
      },
      {
        name: "updatedAt",
        type: "timestamp(3) without time zone",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "viewCount",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
      },
      {
        name: "xata_createdat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
      },
      {
        name: "xata_updatedat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
      },
    ],
  },
  {
    name: "PersonaBookmark",
    columns: [
      {
        name: "createdAt",
        type: "timestamp(3) without time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "personaId",
        type: "link",
        link: { table: "Persona" },
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "userId",
        type: "link",
        link: { table: "User" },
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "xata_createdat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
      },
      {
        name: "xata_updatedat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
      },
    ],
  },
  {
    name: "PersonaGeneration",
    columns: [
      {
        name: "createdAt",
        type: "timestamp(3) without time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: null,
      },
      {
        name: "personaId",
        type: "link",
        link: { table: "Persona" },
        notNull: false,
        unique: false,
        defaultValue: null,
      },
      {
        name: "promptId",
        type: "link",
        link: { table: "PersonaPrompt" },
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "status",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: "'queued'::text",
      },
      {
        name: "updatedAt",
        type: "timestamp(3) without time zone",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "xata_createdat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
      },
      {
        name: "xata_updatedat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
      },
    ],
  },
  {
    name: "PersonaLike",
    columns: [
      {
        name: "createdAt",
        type: "timestamp(3) without time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "personaId",
        type: "link",
        link: { table: "Persona" },
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "userId",
        type: "link",
        link: { table: "User" },
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "xata_createdat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
      },
      {
        name: "xata_updatedat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
      },
    ],
  },
  {
    name: "PersonaPrompt",
    columns: [
      {
        name: "createdAt",
        type: "timestamp(3) without time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "creatorId",
        type: "link",
        link: { table: "User" },
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('pp_'::text || (xata_private.xid())::text)",
      },
      {
        name: "input",
        type: "json",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "isPublic",
        type: "bool",
        notNull: true,
        unique: false,
        defaultValue: "false",
      },
      {
        name: "name",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: "'New prompt'::text",
      },
      {
        name: "personasQueue",
        type: "multiple",
        notNull: false,
        unique: false,
        defaultValue: null,
      },
      {
        name: "publishedAt",
        type: "timestamp(3) without time zone",
        notNull: false,
        unique: false,
        defaultValue: null,
      },
      {
        name: "updatedAt",
        type: "timestamp(3) without time zone",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "xata_createdat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
      },
      {
        name: "xata_updatedat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
      },
    ],
  },
  {
    name: "User",
    columns: [
      {
        name: "createdAt",
        type: "timestamp(3) without time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "email",
        type: "text",
        notNull: false,
        unique: true,
        defaultValue: null,
      },
      {
        name: "id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: null,
      },
      {
        name: "updatedAt",
        type: "timestamp(3) without time zone",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "username",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
      },
      {
        name: "xata_createdat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
      },
      {
        name: "xata_updatedat",
        type: "timestamp(6) with time zone",
        notNull: true,
        unique: false,
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
      },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Comment = InferredTypes["Comment"];
export type CommentRecord = Comment & XataRecord;

export type Image = InferredTypes["Image"];
export type ImageRecord = Image & XataRecord;

export type Persona = InferredTypes["Persona"];
export type PersonaRecord = Persona & XataRecord;

export type PersonaBookmark = InferredTypes["PersonaBookmark"];
export type PersonaBookmarkRecord = PersonaBookmark & XataRecord;

export type PersonaGeneration = InferredTypes["PersonaGeneration"];
export type PersonaGenerationRecord = PersonaGeneration & XataRecord;

export type PersonaLike = InferredTypes["PersonaLike"];
export type PersonaLikeRecord = PersonaLike & XataRecord;

export type PersonaPrompt = InferredTypes["PersonaPrompt"];
export type PersonaPromptRecord = PersonaPrompt & XataRecord;

export type User = InferredTypes["User"];
export type UserRecord = User & XataRecord;

export type DatabaseSchema = {
  Comment: CommentRecord;
  Image: ImageRecord;
  Persona: PersonaRecord;
  PersonaBookmark: PersonaBookmarkRecord;
  PersonaGeneration: PersonaGenerationRecord;
  PersonaLike: PersonaLikeRecord;
  PersonaPrompt: PersonaPromptRecord;
  User: UserRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL: "https://mynth-uuv8ir.us-east-1.xata.sh/db/persona",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};