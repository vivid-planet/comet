---
"@comet/admin": patch
---

Fix typing of `Field`'s `shouldScrollTo()`, `shouldShowError()` and `shouldShowWarning()` props.

Previously, all methods were incorrectly typed as 

```ts
(meta: FieldMetaState<FieldValue>) => boolean;
```

when in fact an object containing the `FieldMetaState` is passed. The typing is now correct:

```ts
({ fieldMeta }: { fieldMeta: FieldMetaState<FieldValue> }) => boolean;
```