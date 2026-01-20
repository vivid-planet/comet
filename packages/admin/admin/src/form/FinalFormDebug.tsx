import { useState } from "react";
import { type AnyObject, FormSpy } from "react-final-form";

import { Alert } from "../alert/Alert";

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
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        style={{
                            marginTop: "8px",
                            marginBottom: isExpanded ? "8px" : "0",
                            cursor: "pointer",
                            padding: "4px 8px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            background: "#fff",
                        }}
                    >
                        {isExpanded ? "Collapse" : "Expand"}
                    </button>
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
