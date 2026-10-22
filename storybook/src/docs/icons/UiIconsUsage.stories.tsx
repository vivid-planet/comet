import { Accept } from "@dextinity/icons";

export default {
    title: "Docs/Icons and Logo/Dextinity Icons Usage",
    tags: ["!dev", "!autodocs"],
};

export const Icon = () => <Accept />;

export const LabeledIcon = () => <Accept aria-label="Accepted" />;

export const Size = () => (
    <>
        <style>{`
            .largeIcon {
                width: 32px;
                height: 32px;
            }
        `}</style>
        <Accept className="largeIcon" />
    </>
);

export const Color = () => (
    <>
        <style>{`
            .blueText {
                color: royalblue;
            }
        `}</style>
        <span className="blueText">
            <Accept />
        </span>
    </>
);
