import React, { type ReactElement, useState } from "react";
import { AddonPanel, Badge } from "storybook/internal/components";
import { useChannel } from "storybook/manager-api";

const RENDER_RESULT_EVENT = "comet-mail-render-result";

interface MjmlWarning {
    tagName: string;
    line: number;
    message: string;
}

interface RenderResult {
    mjmlWarnings: MjmlWarning[];
}

export function MjmlWarningsPanelTitle() {
    const [warnings, setWarnings] = useState<MjmlWarning[]>([]);

    useChannel({
        [RENDER_RESULT_EVENT]: ({ mjmlWarnings }: RenderResult) => {
            setWarnings(mjmlWarnings);
        },
    });

    const hasWarnings = warnings.length > 0;

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>MJML Warnings</span>{" "}
            <Badge compact status={hasWarnings ? "negative" : "positive"}>
                {hasWarnings ? warnings.length : "✓"}
            </Badge>
        </div>
    );
}

export function MjmlWarningsPanelContent({ active }: { active: boolean }): ReactElement {
    const [warnings, setWarnings] = useState<MjmlWarning[] | undefined>();

    useChannel({
        [RENDER_RESULT_EVENT]: ({ mjmlWarnings }: RenderResult) => {
            setWarnings(mjmlWarnings);
        },
    });

    return (
        <AddonPanel active={active}>
            <MjmlWarningsList warnings={warnings} />
        </AddonPanel>
    );
}

function MjmlWarningsList({ warnings }: { warnings: MjmlWarning[] | undefined }): ReactElement | null {
    if (warnings === undefined) {
        return null;
    }

    if (warnings.length === 0) {
        return <p style={{ color: "green", padding: "16px" }}>✓ No MJML warnings</p>;
    }

    return (
        <ul style={{ padding: "16px", margin: 0, listStyle: "none" }}>
            {warnings.map((warning, index) => (
                <li key={index} style={{ marginBottom: "8px" }}>
                    <strong>&lt;{warning.tagName}&gt;</strong> (line {warning.line}): {warning.message}
                </li>
            ))}
        </ul>
    );
}
