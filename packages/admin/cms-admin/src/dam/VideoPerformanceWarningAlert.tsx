import { Alert, type AlertProps } from "@comet/admin";
import { FormattedMessage } from "react-intl";

type VideoPerformanceWarningAlertProps = Omit<AlertProps, "severity" | "title" | "children">;

export function VideoPerformanceWarningAlert(props: VideoPerformanceWarningAlertProps) {
    return (
        <Alert
            severity="warning"
            title={<FormattedMessage id="comet.dam.videoPerformanceWarning.title" defaultMessage="Large video file" />}
            {...props}
        >
            <FormattedMessage
                id="comet.dam.videoPerformanceWarning.text"
                defaultMessage="This video is very large. Videos are delivered without optimization, which can lead to poor loading performance."
            />
        </Alert>
    );
}
