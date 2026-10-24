/** Shared by the API's block schemas and the admin's blocks, which add labels */
export const spacings = ["d100", "d200", "d300", "d400", "s100", "s200", "s300", "s400", "s500", "s600"] as const;

export const mediaAspectRatios = ["16x9", "4x3", "3x2", "3x1", "2x1", "1x1", "1x2", "1x3", "2x3", "3x4", "9x16"] as const;

/** The aspect ratios the DAM can crop images to, which the text image block offers */
export const imageAspectRatios = ["16x9", "4x3", "3x2", "3x1", "2x1", "1x1", "1x2", "1x3", "2x3", "3x4", "9x16", "1200x630"] as const;

export const headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

export const columnsLayouts = [
    { name: "2-20-2", columns: 1 },
    { name: "4-16-4", columns: 1 },
    { name: "6-12-6", columns: 1 },
    { name: "9-9", columns: 2 },
    { name: "12-6", columns: 2 },
    { name: "6-12", columns: 2 },
] as const;

export const layoutBlockLayouts = ["layout1", "layout2", "layout3", "layout4", "layout5", "layout6", "layout7"] as const;
