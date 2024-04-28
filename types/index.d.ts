import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";
import type * as schema from "@/server/db/schema";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

type Voice = {
  voice_id: string;
  name: string;
  category: string;
  fine_tuning: fine_tuning;
  description: string;
  preview_url: string;
  settings: settings;
  sharing: sharing;
  safety_control: string;
  owner_id: string;
  permission_on_resource: string;
};
