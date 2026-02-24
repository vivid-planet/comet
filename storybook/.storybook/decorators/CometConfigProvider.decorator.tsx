import { CometConfigProvider } from "@comet/cms-admin";
import { type Decorator } from "@storybook/react-webpack5";

export const CometConfigProviderDecorator: Decorator = (fn, context) => {
    return (
        <CometConfigProvider
            graphQLApiUrl="/graphql"
            apiUrl=""
            adminUrl=""
            dam={{
                uploadsMaxFileSize: 500,
                allowedImageAspectRatios: ["16x9", "4x3", "3x2", "3x1", "2x1", "1x1", "1x2", "1x3", "2x3", "3x4", "9x16", "1200x630"],
                maxSrcResolution: 70,
            }}
        >
            {fn()}
        </CometConfigProvider>
    );
};
