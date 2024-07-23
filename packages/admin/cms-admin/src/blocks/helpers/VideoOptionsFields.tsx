import { Field, FinalFormSwitch, OnChangeField } from "@comet/admin";
import { FormControlLabel } from "@mui/material";
import * as React from "react";
import { useForm } from "react-final-form";
import { FormattedMessage } from "react-intl";

export const VideoOptionsFields = () => {
    const form = useForm();
    return (
        <>
            <Field name="autoplay" type="checkbox">
                {(props) => (
                    <FormControlLabel
                        label={<FormattedMessage id="comet.blocks.video.autoplay" defaultMessage="Autoplay" />}
                        control={<FinalFormSwitch {...props} />}
                    />
                )}
            </Field>
            <Field name="loop" type="checkbox">
                {(props) => (
                    <FormControlLabel
                        label={<FormattedMessage id="comet.blocks.video.loop" defaultMessage="Loop" />}
                        control={<FinalFormSwitch {...props} />}
                    />
                )}
            </Field>
            <Field name="showControls" type="checkbox">
                {(props) => (
                    <FormControlLabel
                        label={<FormattedMessage id="comet.blocks.video.showControls" defaultMessage="Show controls" />}
                        control={<FinalFormSwitch {...props} />}
                    />
                )}
            </Field>
            {/* case: autoplay = false and showControls = false is not allowed */}
            <OnChangeField name="autoplay">
                {(value, previousValue) => {
                    if (!value && previousValue) {
                        form.change("showControls", true);
                    }
                }}
            </OnChangeField>
            <OnChangeField name="showControls">
                {(value, previousValue) => {
                    if (!value && previousValue) {
                        form.change("autoplay", true);
                    }
                }}
            </OnChangeField>
        </>
    );
};
