import "@storybook/react-vite";

declare module "@storybook/react-vite" {
    interface Parameters extends MswParameters, AdminGeneratorConfigParameters {}
}
