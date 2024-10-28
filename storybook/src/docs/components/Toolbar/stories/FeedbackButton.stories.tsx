import { FeedbackButton } from "@comet/admin";
import { Check, Close } from "@comet/admin-icons";
import { Card, CardContent, Typography } from "@mui/material";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";

export default {
    title: "stories/components/Toolbar/Feedback Button",
    decorators: [storyRouterDecorator()],
};

export const Controlled = () => {
    const [loading, setLoading] = React.useState(false);
    const [loadingError, setLoadingError] = React.useState(false);
    const [hasErrors, setHasErrors] = React.useState(false);

    const onClick = () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const onClickError = () => {
        setLoadingError(true);

        setTimeout(() => {
            setHasErrors(true);
            setLoadingError(false);
        }, 2000);

        setTimeout(() => {
            setHasErrors(false);
        }, 4000);
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h2">Controlled FeedbackButton</Typography>
                <Typography my={3}>
                    This FeedbackButton is controlled by the props loading and hasErrors. A promise returned by onClick will be ignored if one of the
                    props is defined.
                </Typography>
                <Typography variant="h3" mb={1}>
                    Success
                </Typography>
                <FeedbackButton
                    color="primary"
                    variant="contained"
                    loading={loading}
                    onClick={onClick}
                    startIcon={<Check />}
                    tooltipSuccessMessage="Saving was successful"
                    tooltipErrorMessage="Error while saving"
                >
                    Click me
                </FeedbackButton>
                <Typography variant="h3" mt={2} mb={1}>
                    Error
                </Typography>
                <FeedbackButton
                    color="primary"
                    variant="contained"
                    loading={loadingError}
                    hasErrors={hasErrors}
                    onClick={onClickError}
                    startIcon={<Close />}
                    tooltipSuccessMessage="Saving was successful"
                    tooltipErrorMessage="Error while saving"
                >
                    Click me
                </FeedbackButton>
            </CardContent>
        </Card>
    );
};

export const Uncontrolled = () => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h2">Uncontrolled FeedbackButton</Typography>
                <Typography my={3}>
                    This FeedbackButton is controlled by the promise returned by the onClick function. Both the loading and hasError props have to be
                    undefined.
                </Typography>
                <Typography variant="h3" mb={1}>
                    Success
                </Typography>
                <FeedbackButton
                    color="primary"
                    variant="contained"
                    onClick={async () => new Promise((resolve) => setTimeout(resolve, 2000))}
                    startIcon={<Check />}
                    tooltipSuccessMessage="Saving was successful"
                    tooltipErrorMessage="Error while saving"
                >
                    Click me
                </FeedbackButton>
                <Typography variant="h3" mt={2} mb={1}>
                    Error
                </Typography>
                <FeedbackButton
                    color="primary"
                    variant="contained"
                    onClick={async () => new Promise((_, reject) => setTimeout(reject, 2000))}
                    startIcon={<Close />}
                    tooltipSuccessMessage="Saving was successful"
                    tooltipErrorMessage="Error while saving"
                >
                    Click me
                </FeedbackButton>
            </CardContent>
        </Card>
    );
};
