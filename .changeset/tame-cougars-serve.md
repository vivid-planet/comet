---
"@comet/cms-site": minor
---

Add `SeoBlock`

Can be used as a  drop-in replacement for `SeoBlock` defined in application code. Add a `resolveOpenGraphImageUrlTemplate` to resolve the correct image URL template when using a custom Open Graph image block.

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



