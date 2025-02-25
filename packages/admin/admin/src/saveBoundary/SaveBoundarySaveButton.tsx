import { Save } from "@comet/admin-icons";
import { FormattedMessage } from "react-intl";

import { FeedbackButton, FeedbackButtonProps } from "../common/buttons/feedback/FeedbackButton";
import { messages } from "../messages";
import { useSavable, useSaveBoundaryApi } from "./SaveBoundary";

type Props = Omit<FeedbackButtonProps, "disabled" | "loading" | "hasErrors" | "onClick">;

export function SaveBoundarySaveButton(props: Props) {
    const saveBoundaryState = useSavable();
    const saveBoundaryApi = useSaveBoundaryApi();
    if (!saveBoundaryState || !saveBoundaryApi) throw new Error("SaveBoundarySaveButton must be inside SaveBoundary");

    return (
        <FeedbackButton
            startIcon={<Save />}
            disabled={!saveBoundaryState.hasChanges}
            loading={saveBoundaryState.saving}
            hasErrors={saveBoundaryState.hasErrors}
            onClick={async () => {
                await saveBoundaryApi.save();
            }}
            {...props}
        >
            <FormattedMessage {...messages.save} />
        </FeedbackButton>
    );
}
