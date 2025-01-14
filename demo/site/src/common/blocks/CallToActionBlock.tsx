import { PropsWithData, WithPreviewComponent } from "@comet/cms-site";
import { CallToActionBlockData } from "@src/blocks.generated";

import { Button, ButtonVariant } from "../components/Button";
import { HiddenIfInvalidLink } from "../helpers/HiddenIfInvalidLink";
import { LinkBlock } from "./LinkBlock";

const buttonVariantMap: Record<CallToActionBlockData["variant"], ButtonVariant> = {
    Contained: "contained",
    Outlined: "outlined",
    Text: "text",
};

export const CallToActionBlock = ({ data }: PropsWithData<CallToActionBlockData>) => (
    <WithPreviewComponent data={data} label="Call To Action">
        <HiddenIfInvalidLink link={data.textLink.link}>
            <Button as={LinkBlock} data={data.textLink.link} variant={buttonVariantMap[data.variant]}>
                {data.textLink.text}
            </Button>
        </HiddenIfInvalidLink>
    </WithPreviewComponent>
);
