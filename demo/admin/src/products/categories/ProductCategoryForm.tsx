import { FinalForm, type FinalFormSubmitEvent, Loading, TextField, useFormApiRef, useStackSwitchApi } from "@comet/admin";
import { trpc } from "@src/trpc/client";
import { type FormApi } from "final-form";
import isEqual from "lodash.isequal";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

type FormValues = { title: string; slug: string };

interface FormProps {
    id?: string;
}

export function ProductCategoryForm({ id }: FormProps) {
    const mode = id ? "edit" : "add";
    const formApiRef = useFormApiRef<FormValues>();
    const stackSwitchApi = useStackSwitchApi();
    //const trpcUtils = trpc.useUtils();

    const { data, error, isLoading /*, refetch*/ } = trpc.productCategories.getById.useQuery({ id: id ?? "" }, { enabled: !!id });
    const createMutation = trpc.productCategories.create.useMutation();
    const updateMutation = trpc.productCategories.update.useMutation();

    const initialValues = useMemo<Partial<FormValues>>(() => (data ? { title: data.title, slug: data.slug } : {}), [data]);

    /*
    // TODO conflict handling
    const saveConflict = useFormSaveConflict({
        checkConflict: async () => {
            if (!id) return false;
            const serverData = await trpcUtils.productCategories.getById.fetch({ id });
            return resolveHasSaveConflict(data?.updatedAt.toISOString(), serverData?.updatedAt.toISOString());
        },
        formApiRef,
        loadLatestVersion: async () => {
            await refetch();
        },
    });
    */

    const handleSubmit = async (formValues: FormValues, form: FormApi<FormValues>, event: FinalFormSubmitEvent) => {
        //if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");
        if (mode === "edit") {
            if (!id) throw new Error();
            await updateMutation.mutateAsync({ id, input: formValues });
        } else {
            const created = await createMutation.mutateAsync(formValues);
            if (!event.navigatingBack) {
                const newId = created?.id;
                if (newId) {
                    setTimeout(() => {
                        stackSwitchApi.activatePage(`edit`, newId);
                    });
                }
            }
        }
    };

    if (error) throw error;
    if (isLoading) {
        return <Loading behavior="fillPageHeight" />;
    }

    return (
        <FinalForm<FormValues>
            apiRef={formApiRef}
            onSubmit={handleSubmit}
            mode={mode}
            initialValues={initialValues}
            initialValuesEqual={isEqual}
            subscription={{}}
        >
            {() => (
                <>
                    {/*saveConflict.dialogs*/}
                    <>
                        <TextField
                            required
                            variant="horizontal"
                            fullWidth
                            name="title"
                            label={<FormattedMessage id="productCategory.title" defaultMessage="Title" />}
                        />

                        <TextField
                            required
                            variant="horizontal"
                            fullWidth
                            name="slug"
                            label={<FormattedMessage id="productCategory.slug" defaultMessage="Slug" />}
                        />
                    </>
                </>
            )}
        </FinalForm>
    );
}
