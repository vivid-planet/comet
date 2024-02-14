---
"@comet/cms-site": minor
---

Move `SeoBlock` from `demo/site/src/blocks/seo` to `@comet/cms-site`

Add a `resolveOpenGraphImageUrlTemplate` prop, which ensures that the url template of custom `openGraphImage` block can be resolved. It is only required if a custom block or a generic type is used.

**Example Default Use Case:**
```tsx
<SeoBlock data={exampleData} title={"Some Example Title"}/>
```

**Example Custom Use Case:**
```tsx
<SeoBlock<SomeCustomImageBlockType> 
    data={exampleData} 
    title={"Some Example Title"} 
    resolveOpenGraphImageUrlTemplate={(block) => block.some.path.to.urlTemplate} />
```



