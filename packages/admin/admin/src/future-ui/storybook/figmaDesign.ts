const ddsFigmaFileUrl = "https://www.figma.com/design/xAe7acdpccDSRCrfeOdAg3/DDS---Dextinity-Admin-UI---V-0.1";

/**
 * Builds the `@storybook/addon-designs` `design` parameter for a frame in the
 * shared DDS Figma file, from the frame's `node-id` (for example `25-2`).
 */
export function figmaDesign({ nodeId }: { nodeId: string }): { type: "figma"; url: string } {
    return {
        type: "figma",
        url: `${ddsFigmaFileUrl}?node-id=${nodeId}`,
    };
}
