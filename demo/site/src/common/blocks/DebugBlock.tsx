/* eslint-disable no-console */
import { PropsWithData, withPreview } from "@comet/cms-site";
import { DebugBlockData } from "@src/blocks.generated";

const __DEBUG_TRIGGER_INFINITE_LOOP__ = true;

export const DebugBlock = withPreview(
    ({ data: { title } }: PropsWithData<DebugBlockData>) => {
        console.log("### Rendering DebugBlock");

        if (__DEBUG_TRIGGER_INFINITE_LOOP__) {
            return (
                <div>
                    <h2>{title}</h2>
                    <input name="title" />
                </div>
            );
        }

        return (
            <div>
                <h2>{title}</h2>
            </div>
        );
    },
    { label: "Debug" },
);
