import "react-image-crop/dist/ReactCrop.css";

import { CancelButton, Field, FormSection, messages, SaveButton } from "@comet/admin";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent as MuiDialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    Grid,
    Switch,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import isEqual from "lodash.isequal";
import * as React from "react";
import { Form } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { ImageCrop } from "../../common/image/ImageCrop";
import { CropSettingsFields } from "../../dam/FileForm/CropSettingsFields";
import { EditImageFormValues } from "../../dam/FileForm/EditFile";
import { GQLFocalPoint } from "../../graphql.generated";

type CropArea = {
    focalPoint: GQLFocalPoint;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
};

const imageStyle = { maxWidth: "60vw", maxHeight: "70vh" };

interface FormValues extends EditImageFormValues {
    useInheritedDamSettings?: boolean;
}

interface Props {
    image: {
        name: string;
        url: string;
        width: number;
        height: number;
        size?: number;
    };
    onClose: () => void;
    initialValues: {
        useInheritedDamSettings?: boolean;
        cropArea?: CropArea;
    };
    onSubmit: (cropArea: CropArea | undefined) => void;
    inheritedDamSettings?: { cropArea: CropArea };
}

const DialogContent = styled(MuiDialogContent)`
    display: grid;
    grid-template-columns: auto 320px;
    padding: 0;
`;

export function EditImageDialog({ image, initialValues, onSubmit, onClose, inheritedDamSettings }: Props): React.ReactElement {
    const handleSubmit = (values: FormValues) => {
        if (values.useInheritedDamSettings) {
            onSubmit(undefined);
        } else {
            let cropArea: CropArea;

            if (values.focalPoint === "SMART") {
                cropArea = {
                    focalPoint: "SMART",
                    x: undefined,
                    y: undefined,
                    width: undefined,
                    height: undefined,
                };
            } else {
                cropArea = {
                    focalPoint: values.focalPoint ?? undefined,
                    x: values.crop.x,
                    y: values.crop.y,
                    width: values.crop.width ? Math.ceil(values.crop.width) : undefined,
                    height: values.crop.height ? Math.ceil(values.crop.height) : undefined,
                };
            }

            onSubmit(cropArea);
        }
    };

    return (
        <Form
            onSubmit={handleSubmit}
            initialValues={{
                useInheritedDamSettings: initialValues.useInheritedDamSettings,
                focalPoint: initialValues.cropArea?.focalPoint ?? "SMART",
                crop: {
                    width: initialValues.cropArea?.width ?? 100,
                    height: initialValues.cropArea?.height ?? 100,
                    x: initialValues.cropArea?.x ?? 0,
                    y: initialValues.cropArea?.y ?? 0,
                },
            }}
            initialValuesEqual={isEqual}
        >
            {({ handleSubmit, values }) => (
                <Dialog open onClose={onClose} maxWidth={false}>
                    <form onSubmit={handleSubmit}>
                        <DialogTitle>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Typography>
                                        <FormattedMessage
                                            id="comet.blocks.image.edit"
                                            defaultMessage="Edit image „{filename}”"
                                            values={{
                                                filename: image.name,
                                            }}
                                        />
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>
                                        <FormattedMessage
                                            id="comet.blocks.image.dimensions"
                                            defaultMessage="{width}x{height}px"
                                            values={{
                                                width: image.width,
                                                height: image.height,
                                            }}
                                        />
                                        {image.size && (
                                            <FormattedMessage
                                                id="comet.blocks.image.size"
                                                defaultMessage=" | {size, number, :: .00 measure-unit/digital-megabyte}"
                                                values={{
                                                    size: image.size / 1024 / 1024,
                                                }}
                                            />
                                        )}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </DialogTitle>
                        <DialogContent>
                            <ImageCrop src={image.url} imageStyle={imageStyle} disabled={values.useInheritedDamSettings} />
                            <div>
                                {inheritedDamSettings !== undefined && (
                                    <>
                                        <Box padding={8}>
                                            <FormSection
                                                title={<FormattedMessage id="comet.blocks.image.dam" defaultMessage="DAM" />}
                                                disableMarginBottom
                                            >
                                                <Field
                                                    name="useInheritedDamSettings"
                                                    label={
                                                        <FormattedMessage
                                                            id="comet.blocks.image.useInheritedDamSettings"
                                                            defaultMessage="Use inherited DAM settings?"
                                                        />
                                                    }
                                                    type="checkbox"
                                                >
                                                    {({ input: { checked, onChange } }) => <YesNoSwitch checked={checked} onChange={onChange} />}
                                                </Field>
                                            </FormSection>
                                        </Box>
                                        <Divider />
                                    </>
                                )}
                                <Box padding={8}>
                                    <CropSettingsFields disabled={inheritedDamSettings === undefined ? false : values.useInheritedDamSettings} />
                                </Box>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <CancelButton type="button" onClick={onClose} />
                            <SaveButton type="submit" />
                        </DialogActions>
                    </form>
                </Dialog>
            )}
        </Form>
    );
}

interface YesNoSwitchProps {
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const YesNoSwitch = ({ checked, onChange }: YesNoSwitchProps): React.ReactElement => {
    return (
        <FormControlLabel
            control={<Switch checked={checked} onChange={onChange} />}
            label={checked ? <FormattedMessage {...messages.yes} /> : <FormattedMessage {...messages.no} />}
        />
    );
};
