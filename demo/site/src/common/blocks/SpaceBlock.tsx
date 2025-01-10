import { PropsWithData } from "@comet/cms-site";
import { styled } from "@pigment-css/react";
import { SpaceBlockData } from "@src/blocks.generated";

export const SpaceBlock = ({ data: { spacing } }: PropsWithData<SpaceBlockData>) => {
    return <Root spacing={spacing} />;
};

//export default withPreview(SpaceBlock, { label: "Space" });

type RootStyleProps = {
    spacing: SpaceBlockData["spacing"];
};
const Root = styled("div")<RootStyleProps>(({ theme }) => ({
    /* Note:
     *
     * spacing must be mapped and can not dynamically be extracted from theme, because one can not access theme values inside a callback function!
     *
     * height: ${({ spacing }) => theme.spacing[spacing]};
     * theme.spacing in this case would always be undefined
     */
    variants: [
        {
            props: { spacing: "S100" },
            style: {
                height: theme.spacing.S100,
            },
        },
        {
            props: { spacing: "S200" },
            style: {
                height: theme.spacing.S200,
            },
        },
        {
            props: { spacing: "S300" },
            style: {
                height: theme.spacing.S300,
            },
        },
        {
            props: { spacing: "S400" },
            style: {
                height: theme.spacing.S400,
            },
        },
        {
            props: { spacing: "S500" },
            style: {
                height: theme.spacing.S500,
            },
        },
        {
            props: { spacing: "S600" },
            style: {
                height: theme.spacing.S600,
            },
        },
        {
            props: { spacing: "D100" },
            style: {
                height: theme.spacing.D100,
            },
        },
        {
            props: { spacing: "D200" },
            style: {
                height: theme.spacing.D200,
            },
        },
        {
            props: { spacing: "D300" },
            style: {
                height: theme.spacing.D300,
            },
        },
        {
            props: { spacing: "D400" },
            style: {
                height: theme.spacing.D400,
            },
        },
    ],
}));

//    height: ${({ theme, spacing }) => theme.spacing[spacing]};
