import { LegacySaveButton } from "@comet/admin";
import { useState } from "react";

export default {
    title: "Docs/Components/SaveButton",
};

export const Basic = {
    render: () => {
        const [saving, setSaving] = useState(false);
        return (
            <LegacySaveButton
                saving={saving}
                onClick={() => {
                    setSaving(true);
                    setTimeout(() => {
                        setSaving(false);
                    }, 1000);
                }}
            />
        );
    },

    name: "SaveButton",
};
