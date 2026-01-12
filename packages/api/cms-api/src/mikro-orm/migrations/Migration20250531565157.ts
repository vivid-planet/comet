import { Migration } from "@mikro-orm/migrations";

export const DAM_FILE_ENTITY_INFO_VIEW = "DamFileEntityInfo";

export class Migration20250531565157 extends Migration {
    async up(): Promise<void> {
        this.addSql(`CREATE OR REPLACE VIEW "${DAM_FILE_ENTITY_INFO_VIEW}" AS
WITH RECURSIVE folder_tree AS (
  -- Root folders
  SELECT
    id,
    "parentId",
    name AS path,
    archived AS any_archived
  FROM "DamFolder"
  WHERE "parentId" IS NULL

  UNION ALL

  -- Recurse into child folders
  SELECT
    f.id,
    f."parentId",
    ft.path || '/' || f.name AS path,
    f.archived OR ft.any_archived AS any_archived
  FROM "DamFolder" f
  JOIN folder_tree ft ON f."parentId" = ft.id
)
SELECT
  file.id::text AS id,
  file.name AS "name",
  ft.path AS "secondaryInformation",
  NOT (file.archived OR COALESCE(ft.any_archived, false)) AS visible
FROM "DamFile" file
LEFT JOIN folder_tree ft ON file."folderId" = ft.id;`);
    }
}
