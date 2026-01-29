import { Box } from "@mui/material";
import { useState } from "react";
import { type AnyObject, FormSpy } from "react-final-form";

import { Alert } from "../alert/Alert";
import { Button } from "../common/buttons/Button";

/**
 * A debug component for React Final Form that displays the complete form state in a collapsible panel.
 *
 * This component renders an info alert with an expandable section that shows all available form state properties
 * including values, errors, validation state, submission state, and field-level metadata. It's useful for
 * development and debugging purposes to inspect the current state of a Final Form.
 *
 * @template FormValues - The type of the form values object. Defaults to `AnyObject`.
 *
 * @example
 * ```tsx
 * <Form onSubmit={handleSubmit}>
 *   {() => (
 *     <>
 *       <Field name="email" component="input" />
 *       <FinalFormDebug />
 *     </>
 *   )}
 * </Form>
 * ```
 *
 * @remarks
 * The component subscribes to all form state properties and displays them as formatted JSON.
 * Use this only during development as it can impact performance with large forms.
 */
export function FinalFormDebug<FormValues = AnyObject>() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <FormSpy<FormValues>
            subscription={{
                dirty: true,
                dirtyFields: true,
                dirtySinceLastSubmit: true,
                errors: true,
                hasSubmitErrors: true,
                hasValidationErrors: true,
                invalid: true,
                pristine: true,
                submitError: true,
                submitErrors: true,
                submitFailed: true,
                submitSucceeded: true,
                submitting: true,
                touched: true,
                valid: true,
                validating: true,
                values: true,
                visited: true,
            }}
        >
            {(formState) => (
                <Alert severity="info" title="Debug Final Form State:">
                    <Box paddingTop={2}>
                        <Button onClick={() => setIsExpanded(!isExpanded)} variant="outlined" size="small">
                            {isExpanded ? "Collapse" : "Expand"}
                        </Button>
                    </Box>
                    {isExpanded && (
                        <>
                            <pre>{`dirty: ${JSON.stringify(formState.dirty, null, 2)}`}</pre>

                            <pre>{`dirtyFields: ${JSON.stringify(formState.dirtyFields, null, 2)}`}</pre>

                            <pre>{`dirtySinceLastSubmit: ${JSON.stringify(formState.dirtySinceLastSubmit, null, 2)}`}</pre>

                            <pre>{`errors: ${JSON.stringify(formState.errors, null, 2)}`}</pre>

                            <pre>{`hasSubmitErrors: ${JSON.stringify(formState.hasSubmitErrors, null, 2)}`}</pre>

                            <pre>{`hasValidationErrors: ${JSON.stringify(formState.hasValidationErrors, null, 2)}`}</pre>

                            <pre>{`invalid: ${JSON.stringify(formState.invalid, null, 2)}`}</pre>

                            <pre>{`pristine: ${JSON.stringify(formState.pristine, null, 2)}`}</pre>

                            <pre>{`submitError: ${JSON.stringify(formState.submitError, null, 2)}`}</pre>

                            <pre>{`submitErrors: ${JSON.stringify(formState.submitErrors, null, 2)}`}</pre>

                            <pre>{`submitFailed: ${JSON.stringify(formState.submitFailed, null, 2)}`}</pre>

                            <pre>{`submitSucceeded: ${JSON.stringify(formState.submitSucceeded, null, 2)}`}</pre>

                            <pre>{`submitting: ${JSON.stringify(formState.submitting, null, 2)}`}</pre>

                            <pre>{`touched: ${JSON.stringify(formState.touched, null, 2)}`}</pre>

                            <pre>{`values: ${JSON.stringify(formState.values, null, 2)}`}</pre>

                            <pre>{`valid: ${JSON.stringify(formState.valid, null, 2)}`}</pre>

                            <pre>{`validating: ${JSON.stringify(formState.validating, null, 2)}`}</pre>

                            <pre>{`visited: ${JSON.stringify(formState.visited, null, 2)}`}</pre>
                        </>
                    )}
                </Alert>
            )}
        </FormSpy>
    );
}
