import { type ReactNode, useCallback } from "react";
import { type FieldValues, FormProvider, type SubmitHandler, useFormContext, type UseFormReturn, useFormState } from "react-hook-form";

import { Savable, useSaveBoundaryApi } from "../../saveBoundary/SaveBoundary";

function SavableRHF({ onSubmit }: { onSubmit: SubmitHandler<any> }) {
    const { isDirty } = useFormState();
    const formContext = useFormContext();

    const doSave = useCallback(
        () =>
            new Promise<boolean>((resolve) => {
                formContext.handleSubmit(
                    async (values) => {
                        try {
                            await onSubmit(values);
                            resolve(true);
                        } catch {
                            resolve(false);
                        }
                    },
                    () => resolve(false),
                )();
            }),
        [formContext, onSubmit],
    );

    const doReset = useCallback(() => {
        formContext.reset();
    }, [formContext]);

    return (
        // hasChanges drives React state rerenders in SaveBoundary; checkForChanges is a synchronous callback for the router prompt
        <Savable hasChanges={isDirty} checkForChanges={() => formContext.formState.isDirty} doSave={doSave} doReset={doReset} />
    );
}

export type RHFFormProps<TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues = TFieldValues> = UseFormReturn<
    TFieldValues,
    TContext,
    TTransformedValues
> & {
    children: ReactNode;
    onSubmit: SubmitHandler<TFieldValues>;
};

export function RHFForm<TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues = TFieldValues>({
    children,
    onSubmit,
    ...form
}: RHFFormProps<TFieldValues, TContext, TTransformedValues>) {
    const saveBoundaryApi = useSaveBoundaryApi();
    if (!saveBoundaryApi) throw new Error("RHFForm must be used inside a SaveBoundary");

    return (
        <FormProvider {...form}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    saveBoundaryApi.save();
                }}
            >
                <SavableRHF onSubmit={onSubmit} />
                {children}
            </form>
        </FormProvider>
    );
}
