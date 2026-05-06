---
"@comet/cms-api": minor
---

Add fullText query support for PageTree (pageTreeFullTextSearch query)

To enable add a fullText column for a PageTree document (Page or others):

```ts
@Index({ type: "fulltext" })
@Property<Page>({ nullable: true, type: new FullTextType(), onUpdate: (page) => blockToMikroOrmFullText(page.content) })
searchableContent?: string;
```

and enable fullText option for PageTreeModule
