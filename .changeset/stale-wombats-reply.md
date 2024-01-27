---
"@comet/admin": major
---

Change the signatures of `shouldScrollToField`, `shouldShowFieldError` and `shouldShowFieldWarning` in `FinalFormContext` to match the corresponding methods in `Field`

The API in `FinalFormContext` was changed from 

```tsx
// ❌
export interface FinalFormContext {
    shouldScrollToField: ({ fieldMeta }: { fieldMeta: FieldMetaState<any> }) => boolean;
    shouldShowFieldError: ({ fieldMeta }: { fieldMeta: FieldMetaState<any> }) => boolean;
    shouldShowFieldWarning: ({ fieldMeta }: { fieldMeta: FieldMetaState<any> }) => boolean;
}
```

to

```tsx
// ✅
export interface FinalFormContext {
    shouldScrollToField: (fieldMeta: FieldMetaState<any>) => boolean;
    shouldShowFieldError: (fieldMeta: FieldMetaState<any>) => boolean;
    shouldShowFieldWarning: (fieldMeta: FieldMetaState<any>) => boolean;
}
```

Now the corresponding methods in `Field` and `FinalFormContext` have the same signature.

