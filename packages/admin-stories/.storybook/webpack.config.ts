import * as webpack from "webpack";

module.exports = async ({ config }: { config: webpack.Configuration }): Promise<webpack.Configuration> => {
    config.module!.rules!.push(
        {
            test: /\.tsx?$/,
            loaders: [
                {
                    loader: require.resolve("@storybook/addon-storysource/loader"),
                    options: { parser: "typescript" },
                },
            ],
            enforce: "pre",
        },
        {
            test: /\.tsx?$/,
            use: [require.resolve("ts-loader"), require.resolve("react-docgen-typescript-loader")],
        },
    );
    config.resolve!.extensions!.push(".ts", ".tsx");
    config.optimization!.minimize = false;

    return config;
};
