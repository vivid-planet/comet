import { createSpaceBlock } from "@comet/cms-admin";
import { type SpaceBlockData } from "@src/blocks.generated";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

const options: { value: SpaceBlockData["spacing"]; label: ReactNode }[] = [
    { value: "D100", label: <FormattedMessage id="spaceBlock.d100" defaultMessage="Dynamic 100" /> },
    { value: "D200", label: <FormattedMessage id="spaceBlock.d200" defaultMessage="Dynamic 200" /> },
    { value: "D300", label: <FormattedMessage id="spaceBlock.d300" defaultMessage="Dynamic 300" /> },
    { value: "D400", label: <FormattedMessage id="spaceBlock.d400" defaultMessage="Dynamic 400" /> },
    { value: "S100", label: <FormattedMessage id="spaceBlock.s100" defaultMessage="Static 100" /> },
    { value: "S200", label: <FormattedMessage id="spaceBlock.s200" defaultMessage="Static 200" /> },
    { value: "S300", label: <FormattedMessage id="spaceBlock.s300" defaultMessage="Static 300" /> },
    { value: "S400", label: <FormattedMessage id="spaceBlock.s400" defaultMessage="Static 400" /> },
    { value: "S500", label: <FormattedMessage id="spaceBlock.s500" defaultMessage="Static 500" /> },
    { value: "S600", label: <FormattedMessage id="spaceBlock.s600" defaultMessage="Static 600" /> },
];

export const SpaceBlock = createSpaceBlock<SpaceBlockData["spacing"]>({ defaultValue: options[0].value, options });
