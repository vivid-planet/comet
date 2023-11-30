import { messages } from "@comet/admin";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, LinearProgressProps, Typography } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

function LinearProgressWithLabel({ message, ...props }: LinearProgressProps & { value: number; message?: React.ReactNode }) {
    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: "100%", mr: 1 }}>
                    <LinearProgress variant="determinate" {...props} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
                </Box>
            </Box>
            {message && (
                <Typography variant="body2" color="text.secondary">
                    {message}
                </Typography>
            )}
        </Box>
    );
}

export function ProgressDialog(props: { title: React.ReactNode; progress: number | undefined; message?: React.ReactNode; onCancel?: () => void }) {
    return (
        <>
            {props.progress !== undefined && (
                <Dialog open={true}>
                    <DialogTitle>{props.title}</DialogTitle>
                    <DialogContent>
                        <LinearProgressWithLabel value={props.progress} message={props.message} />
                    </DialogContent>
                    {props.onCancel && (
                        <DialogActions>
                            <Button onClick={props.onCancel}>
                                <FormattedMessage {...messages.cancel} />
                            </Button>
                        </DialogActions>
                    )}
                </Dialog>
            )}
        </>
    );
}

export function useProgressDialog(options: { title: React.ReactNode; onCancel?: () => void }) {
    const [progress, setProgress] = React.useState<{
        progress: number | undefined;
        message?: React.ReactNode;
    }>({
        progress: undefined,
        message: undefined,
    });

    const updateProgress = React.useCallback((progress: number | undefined, message?: React.ReactNode) => {
        setProgress({ progress, message });
    }, []);

    return {
        progress: progress.progress,
        message: progress.message,
        updateProgress,
        dialog: <ProgressDialog title={options.title} onCancel={options.onCancel} progress={progress.progress} message={progress.message} />,
    };
}
