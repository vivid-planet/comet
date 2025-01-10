import { PropsWithData } from "@comet/cms-site";
import { CallToActionBlockData } from "@src/blocks.generated";

import { Button, ButtonVariant } from "../components/Button";
import { HiddenIfInvalidLink } from "../helpers/HiddenIfInvalidLink";
import { LinkBlock } from "./LinkBlock";

const buttonVariantMap: Record<CallToActionBlockData["variant"], ButtonVariant> = {
    Contained: "contained",
    Outlined: "outlined",
    Text: "text",
};

export const CallToActionBlock = ({ data: { textLink, variant } }: PropsWithData<CallToActionBlockData>) => (
    <HiddenIfInvalidLink link={textLink.link}>
        <Button as={LinkBlock} data={textLink.link} variant={buttonVariantMap[variant]}>
            {textLink.text}
        </Button>
    </HiddenIfInvalidLink>
);

//export default withPreview(CallToActionBlock, { label: "Call To Action" });
