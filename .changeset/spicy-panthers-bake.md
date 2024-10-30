---
"@comet/blocks-api": minor
"@comet/cli": minor
---

Add support for literal arrays to block meta

String, number, boolean, and JSON arrays can be defined by setting `array: true`.

**Example**

```ts
class NewsListBlockData {
    @BlockField({ type: "string", array: true })
    newsIds: string[];
}
```
