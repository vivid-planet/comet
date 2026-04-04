---
"@comet/cms-api": minor
---

Add fulltext query support for PageTree (pageTreeFullTextSearch query)

to enable add a fulltext column for a PageTree document (Page or others):

    @Index({ type: "fulltext" })
    @Property<Page>({ nullable: true, type: new FullTextType(), onUpdate: (page) => mikroOrmBlockFullText(page.content) })
    searchableContent?: string;

and enable fullText option for PageTreeModule
