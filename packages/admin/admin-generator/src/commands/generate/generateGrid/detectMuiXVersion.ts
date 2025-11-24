import fs from "fs";

export function detectMuiXGridVariant(): {
    variant: "community" | "pro" | "premium";
    package: string;
    gridComponent: string;
} {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
    const packages = Object.keys(packageJson.dependencies);
    if (packages.includes("@mui/x-data-grid-premium")) {
        return {
            variant: "premium",
            package: "@mui/x-data-grid-premium",
            gridComponent: "DataGridPremium",
        };
    } else if (packages.includes("@mui/x-data-grid-pro")) {
        return {
            variant: "pro",
            package: "@mui/x-data-grid-pro",
            gridComponent: "DataGridPro",
        };
    } else {
        return {
            variant: "community",
            package: "@mui/x-data-grid",
            gridComponent: "DataGrid",
        };
    }
}
