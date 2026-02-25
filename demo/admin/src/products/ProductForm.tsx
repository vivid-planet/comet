import {
    CheckboxField,
    Field,
    FinalForm,
    type FinalFormSubmitEvent,
    Loading,
    SelectField,
    TextAreaField,
    TextField,
    useFormApiRef,
} from "@comet/admin";
import { type BlockState, createFinalFormBlock, SpaceBlock } from "@comet/cms-admin";
import { MenuItem } from "@mui/material";
import { trpc } from "@src/trpc/client";
import type { RouterOutput } from "@src/trpc/router";
import { type FormApi } from "final-form";
import isEqual from "lodash.isequal";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

const rootBlocks = {
    space: SpaceBlock,
};
type FormValues = Omit<RouterOutput["products"]["getById"], "id" | "createdAt" | "updatedAt" | "space"> & {
    space: BlockState<typeof rootBlocks.space>;
};

interface FormProps {
    id?: string;
    onCreate?: (id: string) => void;
}

export function ProductForm({ id, onCreate }: FormProps) {
    const mode = id ? "edit" : "add";
    const formApiRef = useFormApiRef<FormValues>();

    const { data, error, isLoading } = trpc.products.getById.useQuery({ id: id ?? "" }, { enabled: !!id });
    const createMutation = trpc.products.create.useMutation();
    const updateMutation = trpc.products.update.useMutation();

    const initialValues = useMemo<Partial<FormValues>>(
        () =>
            data
                ? { ...data, space: rootBlocks.space.input2State(data.space) }
                : {
                      inStock: false,
                      additionalTypes: [],
                      status: "Unpublished",
                      space: rootBlocks.space.defaultValues(),
                  },
        [data],
    );

    const handleSubmit = async (formValues: FormValues, form: FormApi<FormValues>, event: FinalFormSubmitEvent) => {
        const output = {
            ...formValues,
            space: rootBlocks.space.state2Output(formValues.space),
        };
        if (mode === "edit") {
            if (!id) throw new Error();
            await updateMutation.mutateAsync({ id, input: output });
        } else {
            const created = await createMutation.mutateAsync(output);
            if (!event.navigatingBack) {
                const newId = created?.id;
                if (newId) {
                    setTimeout(() => {
                        onCreate?.(newId);
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
                    <TextField
                        required
                        variant="horizontal"
                        fullWidth
                        name="title"
                        label={<FormattedMessage id="product.title" defaultMessage="Title" />}
                    />
                    <TextField
                        required
                        variant="horizontal"
                        fullWidth
                        name="slug"
                        label={<FormattedMessage id="product.slug" defaultMessage="Slug" />}
                    />
                    <TextAreaField
                        variant="horizontal"
                        fullWidth
                        name="description"
                        label={<FormattedMessage id="product.description" defaultMessage="Description" />}
                    />
                    <TextField variant="horizontal" fullWidth name="price" label={<FormattedMessage id="product.price" defaultMessage="Price" />} />
                    <SelectField name="type" label={<FormattedMessage id="product.type" defaultMessage="Type" />} required fullWidth>
                        <MenuItem value="cap">
                            <FormattedMessage id="product.type.cap" defaultMessage="Cap" />
                        </MenuItem>
                        <MenuItem value="shirt">
                            <FormattedMessage id="product.type.shirt" defaultMessage="Shirt" />
                        </MenuItem>
                        <MenuItem value="tie">
                            <FormattedMessage id="product.type.tie" defaultMessage="Tie" />
                        </MenuItem>
                    </SelectField>
                    <SelectField
                        name="additionalTypes"
                        label={<FormattedMessage id="product.additionalTypes" defaultMessage="Additional Types" />}
                        fullWidth
                        multiple
                    >
                        <MenuItem value="cap">
                            <FormattedMessage id="product.type.cap" defaultMessage="Cap" />
                        </MenuItem>
                        <MenuItem value="shirt">
                            <FormattedMessage id="product.type.shirt" defaultMessage="Shirt" />
                        </MenuItem>
                        <MenuItem value="tie">
                            <FormattedMessage id="product.type.tie" defaultMessage="Tie" />
                        </MenuItem>
                    </SelectField>
                    <CheckboxField name="inStock" label={<FormattedMessage id="product.inStock" defaultMessage="In stock" />} fullWidth />
                    <SelectField name="status" label={<FormattedMessage id="product.status" defaultMessage="Status" />} fullWidth>
                        <MenuItem value="Published">
                            <FormattedMessage id="product.status.published" defaultMessage="Published" />
                        </MenuItem>
                        <MenuItem value="Unpublished">
                            <FormattedMessage id="product.status.unpublished" defaultMessage="Unpublished" />
                        </MenuItem>
                    </SelectField>
                    <Field
                        name="space"
                        isEqual={isEqual}
                        label={<FormattedMessage id="product.space" defaultMessage="Space" />}
                        variant="horizontal"
                        fullWidth
                    >
                        {createFinalFormBlock(rootBlocks.space)}
                    </Field>
                </>
            )}
        </FinalForm>
    );
}
