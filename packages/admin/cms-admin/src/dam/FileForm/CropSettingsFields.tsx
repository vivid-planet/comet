import { Button, Field, FieldContainer, FormSection } from "@comet/admin";
import { Reset } from "@comet/admin-icons";
import { AdminComponentSection } from "@comet/blocks-admin";
import { FormControlLabel, Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChangeEvent } from "react";
import { useForm, useFormState } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { ChooseFocalPoint } from "../../common/image/ChooseFocalPoint";
import { EditImageFormValues } from "./EditFile";

interface Props {
    disabled?: boolean;
}

export function CropSettingsFields({ disabled }: Props): JSX.Element {
    const form = useForm<EditImageFormValues>();
    const {
        values: { focalPoint },
    } = useFormState<EditImageFormValues>();

    const handleSmartFocalPointChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            form.change("focalPoint", "SMART");
        } else {
            form.change("focalPoint", "CENTER");
        }
    };

    const showChooseManualFocusPointButtons = focalPoint !== "SMART";
    const showResetCropAreaButton = focalPoint !== "SMART";

    const Container = disabled ? DisabledFormSection : "div";

    return (
        <Container>
            <FormSection title={<FormattedMessage id="comet.dam.file.cropSettings.sectionTitle" defaultMessage="Crop/Focus settings" />}>
                <FieldContainer
                    fullWidth
                    helperText={
                        <>
                            <FormattedMessage
                                id="comet.dam.file.croppingInfoText"
                                defaultMessage="Cropping selects the maximum visible area. Depending on the aspect ratio, the image may be cropped further on the page."
                            />
                            <br />
                            <br />
                            <FormattedMessage
                                id="comet.dam.file.focusPointInfoText"
                                defaultMessage="The focus point marks the most important part of the image, which is always visible. Choose it wisely."
                            />
                        </>
                    }
                >
                    <AdminComponentSection
                        title={<FormattedMessage id="comet.dam.file.cropSettings.smartFocusPoint.title" defaultMessage="Smart focus point" />}
                    >
                        <FormControlLabel
                            control={<Switch checked={focalPoint === "SMART"} onChange={handleSmartFocalPointChange} />}
                            label={
                                focalPoint === "SMART" ? (
                                    <FormattedMessage id="comet.dam.file.smartFocusPoint.yes" defaultMessage="Yes" />
                                ) : (
                                    <FormattedMessage id="comet.dam.file.smartFocusPoint.no" defaultMessage="No" />
                                )
                            }
                        />
                    </AdminComponentSection>
                </FieldContainer>
                {showChooseManualFocusPointButtons && (
                    <Field
                        name="focalPoint"
                        fullWidth
                        helperText={
                            <FormattedMessage
                                id="comet.blocks.image.hintSelectFocalPoint"
                                defaultMessage="You can also select the focus point by clicking on the bullets in the image."
                            />
                        }
                    >
                        {({ input: { value, onChange } }) => <ChooseFocalPoint focalPoint={value} onChangeFocalPoint={onChange} />}
                    </Field>
                )}
                {showResetCropAreaButton && (
                    <Field name="crop" fullWidth>
                        {({ input: { value, onChange } }) => (
                            <Button
                                startIcon={<Reset />}
                                onClick={() => {
                                    onChange({
                                        ...value,
                                        width: 100,
                                        height: 100,
                                        x: 0,
                                        y: 0,
                                    });
                                }}
                                variant="outlined"
                            >
                                <FormattedMessage id="comet.dam.file.resetCropArea" defaultMessage="Reset crop area" />
                            </Button>
                        )}
                    </Field>
                )}
            </FormSection>
        </Container>
    );
}

const DisabledFormSection = styled("div")`
    opacity: 0.5;
    pointer-events: none;
`;
