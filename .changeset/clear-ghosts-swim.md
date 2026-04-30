---
"@comet/cms-api": minor
---

Add fullText query support for PageTree (pageTreeFullTextSearch query)

to enable add a fullText column for a PageTree document (Page or others):

    @Index({ type: "fulltext" })
    @Property<Page>({ nullable: true, type: new FullTextType(), onUpdate: (page) => blockToMikroOrmFullText(page.content) })
    searchableContent?: string;

and enable fullText option for PageTreeModule
