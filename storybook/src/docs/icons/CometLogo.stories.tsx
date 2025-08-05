import {
    CometDigitalExperienceLogo,
    CometDigitalExperienceLogoDark,
    CometLogoClaimColor,
    CometLogoClaimDark,
    CometLogoNoClaim,
    CometLogoNoClaimColor,
} from "@comet/admin-icons";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj;

const config: Meta = {
    title: "@comet/admin-icons/Comet Logo",
};

export default config;
export const Default: Story = {
    render: () => {
        return <CometDigitalExperienceLogo sx={{ width: "100%", height: "50px" }} />;
    },
};

export const Dark: Story = {
    render: () => {
        return (
            <div
                style={{
                    backgroundColor: "black",
                }}
            >
                <CometDigitalExperienceLogoDark sx={{ width: "100%", height: "50px" }} />
            </div>
        );
    },
};

export const NoClaimColor: Story = {
    render: () => {
        return <CometLogoNoClaimColor sx={{ width: "100%", height: "50px" }} />;
    },
};

export const NoClaim: Story = {
    render: () => {
        return <CometLogoNoClaim sx={{ width: "100%", height: "50px" }} />;
    },
};

export const NoClaimTinted: Story = {
    render: () => {
        return <CometLogoNoClaim sx={{ width: "100%", height: "50px", color: "red" }} />;
    },
};

export const ClaimColor: Story = {
    render: () => {
        return <CometLogoClaimColor sx={{ width: "100%", height: "100px" }} />;
    },
};

export const CometClaimColorDark: Story = {
    render: () => {
        return (
            <div style={{ backgroundColor: "black" }}>
                <CometLogoClaimDark sx={{ width: "100%", height: "100px" }} />
            </div>
        );
    },
};
