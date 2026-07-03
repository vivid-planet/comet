import { Alert, type AlertProps } from "@comet/admin";
import { FormattedMessage } from "react-intl";

/**
 * Message explaining that a video is too large to be delivered with good performance.
 *
 * Videos are currently not optimized before delivery, so large videos can lead to poor performance.
 */
export const DamVideoFileSizeWarningMessage = () => (
    <FormattedMessage
        id="comet.dam.videoFileSizeWarning.message"
        defaultMessage="This video is very large. Videos are not optimized before delivery, which can lead to poor performance."
    />
);

type DamVideoFileSizeWarningProps = Omit<AlertProps, "severity" | "title" | "children">;

export const DamVideoFileSizeWarning = (props: DamVideoFileSizeWarningProps) => (
    <Alert severity="warning" title={<FormattedMessage id="comet.dam.videoFileSizeWarning.title" defaultMessage="Large video" />} {...props}>
        <DamVideoFileSizeWarningMessage />
    </Alert>
);
