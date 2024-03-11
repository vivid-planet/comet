import { css, generateUtilityClass, styled, Theme } from "@mui/material";
import { CSSProperties } from "@mui/material/styles/createMixins";
import React from "react";

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

type Styles = ReturnType<typeof css> | CSSProperties;

type SlotStyles<OwnerState extends object | undefined> = Styles | ((props: { theme: Theme } & OwnerStateObjectIfDefined<OwnerState>) => Styles);

export const createSlot = <C extends React.ElementType | keyof JSX.IntrinsicElements>(component: C) => {
    return <ClassKey extends string, OwnerState extends object | undefined = undefined>(options: Options<ClassKey, OwnerState>) => {
        return (styles: SlotStyles<OwnerState> = css``) => {
            return withClassName(
                // @ts-expect-error TODO: Fix the type. ...
                styled(component, {
                    name: options.componentName,
                    slot: options.slotName,
                    overridesResolver(_, styles) {
                        // @ts-expect-error TODO: Fix the type. ...
                        const resolvedClasses = getResolvedClasses<ClassKey, OwnerState>(options, ownerState);
                        const allClasses = [options.slotName, ...resolvedClasses].filter(Boolean);
                        return allClasses.map((classKey) => styles[classKey]);
                    },
                })<OwnerStateObjectIfDefined<OwnerState>>(
                    // @ts-expect-error TODO: Fix the type. ...
                    typeof styles === "function" ? ({ theme, ownerState }) => styles({ theme, ownerState }) : styles,
                ),
                options,
            );
        };
    };
};

function withClassName<C extends React.FunctionComponent<unknown>>(Component: C, options: Options<string, object | undefined>) {
    // @ts-expect-error TODO: Fix the type. ...
    const WithClassName = React.forwardRef<unknown, React.ComponentProps<C>>(({ className, ownerState, ...restProps }, ref) => {
        const resolvedClassNames = getResolvedClassNames(options, ownerState);
        const customClassName = [className, ...resolvedClassNames].filter(Boolean).join(" ");
        // @ts-expect-error TODO: Fix the type. ...
        return <Component {...restProps} ownerState={ownerState} className={customClassName} ref={ref} />;
    });

    return WithClassName;
}

const classNamePrefix = "CometAdmin";

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
