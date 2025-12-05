---
"@comet/admin-rte": minor
---

Deprecate `createFinalFormRte` and add the new `createRteField` helper as a replacement

`createRteField` can be used to get the field-component directly, which does not need to be combined with the `Field` component.
Additionally, when using `createRteField`, the `requiredValidator` is automatically applied when setting the `required` prop.

**Example usage:**

```tsx
import { createRteField } from "@comet/admin-rte";

const { RteField } = createRteField();

export const ExampleFields = () => {
    return (
        <>
            <RteField name="optionalRteContent" label="Rich Text (optional)" />
            <RteField name="requiredRteContent" label="Rich Text (required)" required />
        </>
    );
};
```

**Example replacement of `createFinalFormRte`:**

```diff
-import { Field } from "@comet/admin";
-import { createFinalFormRte, requiredValidator } from "@comet/admin-rte";
+import { createRteField } from "@comet/admin-rte";
 import { Form } from "react-final-form";

-const { RteField } = createFinalFormRte();
+const { RteField } = createRteField();

 type FormValues = {
     optionalRteContent: string;
     requiredRteContent: string;
 };

 export const ExampleForm = () => {
     return (
         <Form<FormValues>
             onSubmit={(values) => {
                 // Handle submit
             }}
             render={({ handleSubmit }) => (
                 <form onSubmit={handleSubmit}>
-                    <Field name="optionalRteContent" label="Rich Text (optional)" component={RteField} />
+                    <RteField name="optionalRteContent" label="Rich Text (optional)" />

-                    <Field name="requiredRteContent" label="Rich Text (required)" component={RteField} required validate={requiredValidator} />
+                    <RteField name="requiredRteContent" label="Rich Text (required)" required />
                 </form>
             )}
         />
     );
 };
```
