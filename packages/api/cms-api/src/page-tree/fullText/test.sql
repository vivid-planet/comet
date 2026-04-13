SELECT "ptn"."id" "pageTreeNodeId", "ft"."fullText" || COALESCE("ptn"."searchable", ''::tsvector) AS "fullText"
FROM "PageTreeNode" "ptn"
INNER JOIN "PageTreeNodeDocument" "ad" ON "ad"."pageTreeNodeId" = "ptn"."id" AND "ad"."type" = "ptn"."documentType"
INNER JOIN "PageTreeDocumentFullText" "ft" ON "ad"."documentId" = "ft"."documentId" AND "ft"."type" = "ptn"."documentType"

