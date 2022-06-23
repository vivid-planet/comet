import * as React from "react";
import { AnyObject, Form, FormProps, FormSpy } from "react-final-form";

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
 * @deprecated For BlockAdmins use BlocksFinalForm instead.
 *
 * @TODO: Should we keepo this form, for some use cases its still valuable (AddFile.tsx),
 * BlocksFinalForm is not appropriate when an invalid form should not be submitted
 */
export function AutosaveFinalForm<FormValues = AnyObject>(props: FormProps<FormValues>): JSX.Element {
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
