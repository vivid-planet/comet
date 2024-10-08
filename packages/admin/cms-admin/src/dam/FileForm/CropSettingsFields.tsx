import { Field, FieldContainer, FormSection } from "@comet/admin";
import { Reset } from "@comet/admin-icons";
import { Box, Button, FormControlLabel, Switch, Typography } from "@mui/material";
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
                <FieldContainer>
                    <FormControlLabel
                        control={<Switch checked={focalPoint === "SMART"} onChange={handleSmartFocalPointChange} />}
                        label={<FormattedMessage id="comet.dam.file.smartFocusPoint" defaultMessage="Smart focus point" />}
                    />
                    <Box mt={2} pl={2}>
                        <Typography variant="body2" paragraph>
                            <FormattedMessage
                                id="comet.dam.file.croppingInfoText"
                                defaultMessage="Cropping selects the maximum visible area. Depending on the aspect ratio, the image may be cropped further on the page."
                            />
                        </Typography>
                        <Typography variant="body2">
                            <FormattedMessage
                                id="comet.dam.file.focusPointInfoText"
                                defaultMessage="The focus point marks the most important part of the image, which is always visible. Choose it wisely."
                            />
                        </Typography>
                    </Box>
                </FieldContainer>
                {showChooseManualFocusPointButtons && (
                    <Field name="focalPoint">
                        {({ input: { value, onChange } }) => <ChooseFocalPoint focalPoint={value} onChangeFocalPoint={onChange} />}
                    </Field>
                )}
                {showResetCropAreaButton && (
                    <Field name="crop">
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
                                color="info"
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
