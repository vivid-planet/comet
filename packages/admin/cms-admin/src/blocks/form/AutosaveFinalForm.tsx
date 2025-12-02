import { Form, type FormProps, FormSpy } from "react-final-form";

function AutosaveSpy() {
    return (
        <FormSpy subscription={{ dirty: true }}>
            {({ form, dirty }) => {
                if (dirty) {
                    // works around endless loop when using setState from inside render
                    setTimeout(() => {
                        form.submit();
                    }, 1);
                }
                return null;
            }}
        </FormSpy>
    );
}
/**
 * @deprecated Use `BlocksFinalForm` instead
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AutosaveFinalForm<FormValues = Record<string, any>>(props: FormProps<FormValues>): JSX.Element {
    return <Form {...props} render={renderForm} />;

    function renderForm() {
        return (
            <>
                <AutosaveSpy />
                {props.children}
            </>
        );
    }
}
