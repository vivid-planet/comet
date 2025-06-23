import { Field, FieldSet, FinalFormInput } from "@comet/admin";
import { Delete } from "@comet/admin-icons";
import { AdminComponentButton } from "@comet/blocks-admin";
import { Grid, IconButton } from "@mui/material";
import { FieldArray } from "react-final-form-arrays";
import { FormattedMessage } from "react-intl";

import { FileField } from "../../../form/file/FileField";
import { useDamAcceptedMimeTypes } from "../../config/useDamAcceptedMimeTypes";

export const CaptionsLinkedFilesFields = () => {
    const acceptedMimeTypes = useDamAcceptedMimeTypes();

    return (
        <FieldSet title={<FormattedMessage id="comet.blocks.video.videos" defaultMessage="Linked videos" />}>
            <FieldArray name="videos">
                {({ fields }) => {
                    return (
                        <>
                            {fields.map((name, i) => (
                                <Grid container spacing={2} key={name} alignItems="center" sx={{ mb: 2 }}>
                                    <Grid item xs={6}>
                                        <Field
                                            name={`${name}.source`}
                                            component={FileField}
                                            fullWidth
                                            allowedMimetypes={acceptedMimeTypes.filteredAcceptedMimeTypes.video}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Field name={`${name}.language`} component={FinalFormInput} placeholder="en" fullWidth />
                                    </Grid>
                                    <Grid item>
                                        <IconButton onClick={() => fields.remove(i)} size="large">
                                            <Delete />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <AdminComponentButton variant="primary" onClick={() => fields.push({ file: undefined })}>
                                <FormattedMessage id="comet.blocks.video.addCaptionsToVideo" defaultMessage="Add captions to video" />
                            </AdminComponentButton>
                        </>
                    );
                }}
            </FieldArray>
        </FieldSet>
    );
};
