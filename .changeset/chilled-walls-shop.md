---
"@comet/eslint-config": major
---

Add the rule `@typescript-eslint/prefer-enum-initializers` to require enum initializers

```ts
// ✅
enum ExampleEnum {
    One = "One",
    Two = "Two",
}
```

```ts
// ❌
enum ExampleEnum {
    One,
    Two,
}
```
