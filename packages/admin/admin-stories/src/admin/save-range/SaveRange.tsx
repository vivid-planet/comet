import { SubmissionBoundary, SubmissionBoundarySaveButton, SubmissionBoundaryState } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

async function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

function DemoForm() {
    console.log("Render DemoForm");
    const [saving, setSaving] = React.useState(false);
    const [input, setInput] = React.useState("");

    const doSave = React.useCallback(async () => {
        setSaving(true);
        await delay(1000);
        setSaving(false);
        if (input == "err") {
            return false;
        }
        return true;
    }, [input]);
    /*
    const doSave = async () => {
        setSaving(true);
        await delay(1000);
        setSaving(false);
        if (input == "err") {
            return false;
        }
        return true;
    };
    */
    return (
        <div>
            DemoForm <SubmissionBoundaryState hasChanges={input != ""} doSave={doSave} />
            <input value={input} onChange={(e) => setInput(e.target.value)} />
            {saving && <>Saving...</>}
        </div>
    );
}
function UnrelatedChild() {
    console.log("Render UnrelatedChild");
    return <p>UnrelatedChild</p>;
}

function SaveButtonContainer() {
    console.log("Render SaveButtonContainer");
    return <SubmissionBoundarySaveButton />;
}

function Story() {
    return (
        <SubmissionBoundary>
            <DemoForm />
            <DemoForm />
            <UnrelatedChild />
            <SaveButtonContainer />
        </SubmissionBoundary>
    );
}

storiesOf("@comet/admin/save-range", module)
    .addDecorator(storyRouterDecorator())
    .add("SubmissionBoundary", () => <Story />);
