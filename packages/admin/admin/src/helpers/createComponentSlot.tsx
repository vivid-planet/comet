import { StyledComponent } from "@emotion/styled";
import { css, generateUtilityClass, styled, Theme } from "@mui/material";
import { CSSProperties } from "@mui/material/styles/createMixins";
import React from "react";

const classNamePrefix = "CometAdmin";

type Options<ClassKey extends string, OwnerState extends object | undefined> = {
    componentName: string;
    slotName: ClassKey;
    classesResolver?: (ownerState: OwnerState) => (ClassKey | false | undefined)[];
};

type OwnerStateObjectIfDefined<OwnerState extends object | undefined> = OwnerState extends object
    ? {
          ownerState: OwnerState;
      }
    : {
          ownerState?: undefined;
      };

type StylesStringOrObject = ReturnType<typeof css> | CSSProperties;

type SlotStylesOrStylesFunction<OwnerState extends object | undefined> =
    | StylesStringOrObject
    | ((props: { theme: Theme } & OwnerStateObjectIfDefined<OwnerState>) => StylesStringOrObject);

export const createComponentSlot = <BaseComponent extends React.ElementType | keyof JSX.IntrinsicElements>(component: BaseComponent) => {
    return <ClassKey extends string, OwnerState extends object | undefined = undefined>(options: Options<ClassKey, OwnerState>) => {
        return (styles: SlotStylesOrStylesFunction<OwnerState> = css``) => {
            return withClassNameOwnerStateAndRef(
                // @ts-expect-error MUIs `styled` supports the individual types of the `BaseComponent` union type but due to the way the component/tag parameter is typed in `CreateMUIStyled` a union type does not match.
                styled(component, {
                    name: `${classNamePrefix}${options.componentName}`,
                    slot: options.slotName,
                    overridesResolver({ ownerState }, themeStyleOverrides) {
                        const resolvedClasses = getResolvedClasses<ClassKey, OwnerState>(options, ownerState);
                        const allClasses = [options.slotName, ...resolvedClasses].filter(Boolean);
                        return allClasses.map((classKey) => themeStyleOverrides[classKey]);
                    },
                })<OwnerStateObjectIfDefined<OwnerState>>(styles),
                options,
            );
        };
    };
};

function withClassNameOwnerStateAndRef<Props extends object>(
    Component: StyledComponent<Props & { className?: string; ownerState?: object }>,
    options: Options<string, object | undefined>,
) {
    return React.forwardRef<unknown, React.PropsWithChildren<React.ComponentProps<typeof Component>>>((props, ref) => {
        const { className, ownerState } = props;
        const resolvedClassNames = getResolvedClassNames(options, ownerState);
        const customClassName = [className, ...resolvedClassNames].filter(Boolean).join(" ");
        return <Component {...props} className={customClassName} ownerState={ownerState} ref={ref} />;
    });
}

const getResolvedClasses = <ClassKey extends string, OwnerState extends object | undefined>(
    options: Options<ClassKey, OwnerState>,
    ownerState: OwnerState,
): ClassKey[] => {
    const resolvedClasses: ClassKey[] = [options.slotName];

    if (options.classesResolver) {
        const possiblyNonStringResolvedClasses = options.classesResolver(ownerState);
        possiblyNonStringResolvedClasses.forEach((classKey) => {
            if (typeof classKey === "string") {
                resolvedClasses.push(classKey);
            }
        });
    }

    return resolvedClasses;
};

const getResolvedClassNames = <ClassKey extends string, OwnerState extends object | undefined>(
    options: Options<ClassKey, OwnerState>,
    ownerState: OwnerState,
): string[] => {
    const resolvedClasses = getResolvedClasses(options, ownerState);
    return resolvedClasses.map((classKey) => generateUtilityClass(`${classNamePrefix}${options.componentName}`, classKey));
};
