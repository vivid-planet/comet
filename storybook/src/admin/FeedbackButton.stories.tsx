import { FeedbackButton } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { Card, CardContent, Stack } from "@mui/material";

export default {
    title: "@comet/admin/FeedbackButton",
};

export const Default = {
    render: () => (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2}>
                    <FeedbackButton
                        startIcon={<Add />}
                        onClick={() => {
                            return new Promise((resolve) => setTimeout(resolve, 500));
                        }}
                    >
                        This will succeed
                    </FeedbackButton>
                    <FeedbackButton
                        startIcon={<Add />}
                        onClick={() => {
                            return new Promise((_, reject) => setTimeout(reject, 500));
                        }}
                    >
                        This will fail
                    </FeedbackButton>
                    <FeedbackButton
                        startIcon={<Add />}
                        onClick={() => {
                            return new Promise((resolve) => setTimeout(resolve, 500));
                        }}
                        tooltipErrorMessage="This failed but at least it has a custom message"
                        tooltipSuccessMessage="This worked and has a custom message"
                    >
                        Custom message (succeeds)
                    </FeedbackButton>
                    <FeedbackButton
                        startIcon={<Add />}
                        onClick={() => {
                            return new Promise((_, reject) => setTimeout(reject, 500));
                        }}
                        tooltipErrorMessage="This failed but at least it has a custom message"
                        tooltipSuccessMessage="This worked and has a custom message"
                    >
                        Custom message (fails)
                    </FeedbackButton>
                </Stack>
            </CardContent>
        </Card>
    ),
};
