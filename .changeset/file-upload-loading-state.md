---
"@comet/cms-admin": minor
---

Block form submission while `FileUploadField` is uploading

`FileUploadField` now puts its React Final Form field into a validating state (by returning a pending Promise from its `validate` function) for the duration of any file upload. This means:

- `formState.validating` is `true` while a file is being uploaded
- Final Form blocks `form.submit()` until all uploads have completed
- The save button can be disabled by subscribing to `formState.validating`

**Example** — disable the save button while uploading:

```tsx
<FinalForm subscription={{ submitting: true, validating: true }}>
    {({ handleSubmit, submitting, validating }) => (
        <form onSubmit={handleSubmit}>
            <FileUploadField name="file" label="File" />
            <Button type="submit" disabled={submitting || validating}>
                Save
            </Button>
        </form>
    )}
</FinalForm>
```
