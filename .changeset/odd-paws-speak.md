---
"@comet/admin": major
---

FinalForm: remove default `onAfterSubmit` implementation

In most cases the default implementation is not needed anymore. When upgrading, an empty
function override of `onAfterSubmit` can be removed as it is not necessary any longer.

To get back the old behavior use the following in application code:

```
const stackApi = React.useContext(StackApiContext);
const editDialog = React.useContext(EditDialogApiContext);
....
    <FinalForm
        onAfterSubmit={() => {
            stackApi?.goBack();
            editDialog?.closeDialog({ delay: true });
        }}
    >
```