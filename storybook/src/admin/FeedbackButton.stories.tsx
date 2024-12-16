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
                            return new Promise((resolve, reject) => setTimeout(Math.random() > 0.5 ? resolve : reject, 500));
                        }}
                        tooltipErrorMessage="This time it failed"
                        tooltipSuccessMessage="This time it worked"
                    >
                        This is random (and has custom tooltip messages)
                    </FeedbackButton>
                </Stack>
            </CardContent>
        </Card>
    ),
};
