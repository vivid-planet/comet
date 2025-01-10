import { ListBlock, PropsWithData } from "@comet/cms-site";
import { styled } from "@pigment-css/react";
import { CallToActionListBlockData } from "@src/blocks.generated";

import { CallToActionBlock } from "./CallToActionBlock";

type CallToActionListBlockProps = PropsWithData<CallToActionListBlockData>;

export const CallToActionListBlock = ({ data }: CallToActionListBlockProps) =>
    data.blocks.length > 0 ? (
        <Root>
            <ListBlock data={data} block={(block) => <CallToActionBlock data={block} />} />
        </Root>
    ) : null;

//export default withPreview(CallToActionListBlock, { label: "Call To Action List" });

const Root = styled("div")(({ theme }) => ({
    display: "flex",
    flexFlow: "row wrap",
    gap: theme.spacing.S300,
    [theme.breakpoints.sm.mediaQuery]: {
        gap: theme.spacing.S400,
    },
}));
