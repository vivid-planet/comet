import { useTheme } from "@material-ui/core";
import { ComponentsProps } from "@material-ui/core/styles/props";

export function useComponentThemeProps<T extends keyof ComponentsProps>(name: T): ComponentsProps[T] | undefined {
    const { props: themeProps } = useTheme();

    return themeProps?.[name];
}
