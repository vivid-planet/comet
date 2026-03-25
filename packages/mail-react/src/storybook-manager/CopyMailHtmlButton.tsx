import React, { useCallback, useRef, useState } from "react";
import { Button } from "storybook/internal/components";
import { useChannel } from "storybook/manager-api";

const RENDER_RESULT_EVENT = "comet-mail-render-result";
const COPIED_FEEDBACK_DURATION_MS = 2000;

export function CopyMailHtmlButton() {
    const htmlRef = useRef("");
    const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);
    const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useChannel({
        [RENDER_RESULT_EVENT]: ({ html }: { html: string }) => {
            htmlRef.current = html;
            setShowCopiedFeedback(false);
            clearTimeout(feedbackTimeoutRef.current);
        },
    });

    const handleClick = useCallback(async () => {
        await navigator.clipboard.writeText(htmlRef.current);
        setShowCopiedFeedback(true);
        clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = setTimeout(() => setShowCopiedFeedback(false), COPIED_FEEDBACK_DURATION_MS);
    }, []);

    return (
        <Button onClick={handleClick} variant="ghost" size="small">
            {showCopiedFeedback ? "Copied to clipboard!" : "Copy Mail HTML"}
        </Button>
    );
}
