import { useTheme } from "@material-ui/core";
import { ComponentsProps } from "@material-ui/core/styles/props";

export function useComponentThemeProps<T>(name: keyof ComponentsProps): T | undefined {
    const { props: themeProps } = useTheme();

    return themeProps != null ? (themeProps[name] as T) : undefined;
}
