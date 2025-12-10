---
"@comet/admin-rte": minor
---

Add `requiredValidator` to validate if the RTE field is empty

```tsx
import { createFinalFormRte, requiredValidator } from "@comet/admin-rte";

const { RteField } = createFinalFormRte();

const ExampleForm = () => {
    return <Field name="richText" label="Rich Text" component={RteField} required validate={requiredValidator} />;
};
```
