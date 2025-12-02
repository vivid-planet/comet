import { type ComponentNameToClassKey, type ComponentsPropsList, type Interpolation, type Theme } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";

type OverridesStyleRules<ClassKey extends string = string, ComponentName = keyof ComponentsPropsList, Theme = unknown> = Record<
    ClassKey,
    Interpolation<
        // Record<string, unknown> is for other props that the slot receive internally
        // Documenting all ownerStates could be a huge work, let's wait until we have a real needs from developers.
        (ComponentName extends keyof ComponentsPropsList
            ? ComponentsPropsList[ComponentName] &
                  Record<string, unknown> & {
                      ownerState: ComponentsPropsList[ComponentName] & Record<string, unknown>;
                  }
            : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
              {}) & {
            theme: Theme;
        } & Record<string, unknown>
    >
>;

type OwnerState<PropsName extends keyof ComponentsPropsList> = PropsName extends keyof ComponentsPropsList
    ? { ownerState: ComponentsPropsList[PropsName] & Record<string, unknown> }
    : Record<string, unknown>;

type OverrideProps<PropsName extends keyof ComponentsPropsList> = OwnerState<PropsName> & { theme: Theme } & Record<string, unknown>;

type ClassKey<ClassesName extends keyof ComponentNameToClassKey> = ComponentNameToClassKey[ClassesName];

type StyleOverrideInterpolation<ClassKey extends string = string, ComponentName = keyof ComponentsPropsList, Theme = unknown> = OverridesStyleRules<
    ClassKey,
    ComponentName,
    Theme
>[ClassKey];

const getOverridesInterpolation = <PropsName extends keyof ComponentsPropsList>(
    props: OverrideProps<PropsName>,
    overrides?: StyleOverrideInterpolation<PropsName> | undefined,
): StyleOverrideInterpolation => {
    if (typeof overrides === "undefined") {
        return {};
    }

    if (typeof overrides === "function") {
        return overrides(props);
    }

    return overrides;
};

// Overload for standard MUI components
export function mergeOverrideStyles<ComponentName extends keyof ComponentNameToClassKey & keyof ComponentsPropsList>(
    passedIn?: Partial<OverridesStyleRules<ClassKey<ComponentName>>>,
    comet?: Partial<OverridesStyleRules<ClassKey<ComponentName>>>,
): Partial<OverridesStyleRules<ClassKey<ComponentName>>>;

// Overload for components with custom owner state (e.g. MuiPickersTextField from `@mui/x-date-pickers`)
export function mergeOverrideStyles<TStyleOverrides extends Record<string, any>>(
    passedIn?: Partial<TStyleOverrides>,
    comet?: Partial<TStyleOverrides>,
): Partial<TStyleOverrides>;

export function mergeOverrideStyles(passedIn: Record<string, any> = {}, comet: Record<string, any> = {}): Record<string, any> {
    const mergedOverrides = { ...comet };

    Object.keys(passedIn).forEach((classKey: string) => {
        mergedOverrides[classKey] = (props: any) => {
            return deepmerge<StyleOverrideInterpolation>(
                getOverridesInterpolation(props, comet[classKey]),
                getOverridesInterpolation(props, passedIn[classKey]),
            );
        };
    });

    return mergedOverrides;
}
