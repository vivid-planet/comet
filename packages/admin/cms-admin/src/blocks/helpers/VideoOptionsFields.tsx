import { OnChangeField, SwitchField } from "@dextinity/admin";
import { useForm } from "react-final-form";
import { FormattedMessage } from "react-intl";

export type VideoOptionsSupports = "autoplay" | "loop" | "showControls";

const defaultVideoOptionsSupports: VideoOptionsSupports[] = ["autoplay", "loop", "showControls"];

type VideoOptionsFieldsProps = {
    /**
     * Video options offered to the editor. Leave out options that aren't supported by the site implementation.
     * @default ["autoplay", "loop", "showControls"]
     */
    supports?: VideoOptionsSupports[];
};

export const VideoOptionsFields = ({ supports = defaultVideoOptionsSupports }: VideoOptionsFieldsProps = {}) => {
    const form = useForm();
    const supportsAutoplay = supports.includes("autoplay");
    const supportsShowControls = supports.includes("showControls");

    return (
        <>
            {supportsAutoplay && (
                <SwitchField name="autoplay" label={<FormattedMessage id="dextinity.blocks.video.autoplay" defaultMessage="Autoplay" />} />
            )}
            {supports.includes("loop") && (
                <SwitchField name="loop" label={<FormattedMessage id="dextinity.blocks.video.loop" defaultMessage="Loop" />} />
            )}
            {supportsShowControls && (
                <SwitchField
                    name="showControls"
                    label={<FormattedMessage id="dextinity.blocks.video.showControls" defaultMessage="Show controls" />}
                />
            )}
            {/* case: autoplay = false and showControls = false is not allowed. Only relevant if the editor can change both. */}
            {supportsAutoplay && supportsShowControls && (
                <>
                    <OnChangeField name="autoplay">
                        {(value, previousValue) => {
                            if (!value && previousValue) {
                                form.change("showControls", true);
                            }
                        }}
                    </OnChangeField>
                    <OnChangeField name="showControls">
                        {(value, previousValue) => {
                            if (!value && previousValue) {
                                form.change("autoplay", true);
                            }
                        }}
                    </OnChangeField>
                </>
            )}
        </>
    );
};
