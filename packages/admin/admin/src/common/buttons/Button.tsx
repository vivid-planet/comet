import { ThreeDotSaving } from "@comet/admin-icons";
import {
    Breakpoint,
    Button as MuiButton,
    ButtonProps as MuiButtonProps,
    ComponentsOverrides,
    css,
    Theme,
    useTheme,
    useThemeProps,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { FormattedMessage } from "react-intl";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { useWindowSize } from "../../helpers/useWindowSize";
import { Tooltip } from "../Tooltip";

type StateClassKey = "usingResponsiveBehavior" | "feedbackStateLoading" | "feedbackStateSuccess" | "feedbackStateError";
type SlotClassKey = "root" | "mobileTooltip" | "successFeedback" | "errorFeedback";

export type ButtonClassKey = StateClassKey | SlotClassKey;

type ButtonThemeProps = ThemedComponentBaseProps<{
    root: typeof MuiButton;
    mobileTooltip: typeof Tooltip;
    successFeedback: typeof Tooltip;
    errorFeedback: typeof Tooltip;
}>;

type ResponsiveBehaviorSettings = {
    breakpoint: Breakpoint;
    mobileIcon: ReactNode;
};

type ResponsiveBehaviorOptions = Omit<Partial<ResponsiveBehaviorSettings>, "mobileIcon"> & {
    mobileIcon?: "startIcon" | "endIcon" | ReactNode;
};

type FeedbackBehaviorOptions = {
    state?: ButtonFeedbackState | null;
    successMessage?: ReactNode;
    errorMessage?: ReactNode;
    successDuration?: number;
    errorDuration?: number;
};

export type ButtonFeedbackState = "none" | "loading" | "success" | "error";

type OwnerState = {
    usingResponsiveBehavior: boolean;
    feedbackState: ButtonFeedbackState;
};

type CustomButtonProps = {
    responsiveBehavior?: boolean | ResponsiveBehaviorOptions;
    feedbackBehavior?: boolean | FeedbackBehaviorOptions;
    iconMapping?: {
        loading?: ReactNode;
    };
};

type OnClick = ((event: React.MouseEvent<HTMLElement>) => void) | ((event: React.MouseEvent<HTMLElement>) => Promise<void>);

export type ButtonProps = CustomButtonProps & ButtonThemeProps & MuiButtonProps & { onClick?: OnClick };

const getResponsiveBehaviorSettings = (propValue: ButtonProps["responsiveBehavior"], startIcon: ReactNode, endIcon: ReactNode) => {
    let settings: ResponsiveBehaviorSettings = {
        breakpoint: "sm",
        mobileIcon: startIcon || endIcon,
    };

    if (typeof propValue === "object") {
        settings = {
            ...settings,
            ...propValue,
        };

        if (propValue.mobileIcon === undefined || propValue.mobileIcon === "startIcon") {
            settings.mobileIcon = startIcon;
        } else if (settings.mobileIcon === "endIcon") {
            propValue.mobileIcon = endIcon;
        } else {
            settings.mobileIcon = propValue.mobileIcon;
        }
    }

    return settings;
};

const defaultFeedbackBehaviorSettings = {
    successMessage: <FormattedMessage id="comet.feedbackButton.tooltipSuccessMessage" defaultMessage="Success" />,
    errorMessage: <FormattedMessage id="comet.feedbackButton.tooltipErrorMessage" defaultMessage="Error" />,
    successDuration: 2000,
    errorDuration: 5000,
    state: null,
};

export const Button = (props: ButtonProps) => {
    const {
        iconMapping = {},
        slotProps,
        responsiveBehavior,
        feedbackBehavior,
        children,
        onClick,
        startIcon,
        endIcon,
        ...restProps
    } = useThemeProps({
        props,
        name: "CometAdminButton",
    });

    const windowSize = useWindowSize();
    const theme = useTheme();

    const { loading: loadingIcon = <ThreeDotSaving /> } = iconMapping;

    const responsiveBehaviorSettings = getResponsiveBehaviorSettings(responsiveBehavior, startIcon, endIcon);
    const usingResponsiveBehavior = Boolean(responsiveBehavior) && windowSize.width < theme.breakpoints.values[responsiveBehaviorSettings.breakpoint];

    const [uncontrolledFeedbackState, setUncontrolledFeedbackState] = useState<ButtonFeedbackState>("none");
    const feedbackBehaviorSettings: Required<FeedbackBehaviorOptions> =
        typeof feedbackBehavior === "object" ? { ...defaultFeedbackBehaviorSettings, ...feedbackBehavior } : defaultFeedbackBehaviorSettings;
    const feedbackStateIsControlledByProp = feedbackBehaviorSettings.state !== null;
    const feedbackState = feedbackBehaviorSettings.state ?? uncontrolledFeedbackState;

    const handleClick: OnClick = async (event) => {
        if (feedbackStateIsControlledByProp) {
            onClick?.(event);
            return;
        }

        try {
            setUncontrolledFeedbackState("loading");
            await onClick?.(event);
            setUncontrolledFeedbackState("success");
            setTimeout(() => {
                setUncontrolledFeedbackState("none");
            }, feedbackBehaviorSettings.successDuration);
        } catch (error) {
            setUncontrolledFeedbackState("error");
            setTimeout(() => {
                setUncontrolledFeedbackState("none");
            }, feedbackBehaviorSettings.errorDuration);
        }
    };

    const loadingFeedbackStateProps =
        feedbackState === "loading"
            ? {
                  disabled: true,
                  startIcon: loadingIcon,
              }
            : {};

    const ownerState: OwnerState = {
        usingResponsiveBehavior,
        feedbackState,
    };

    const buttonNode = (
        <Root
            startIcon={usingResponsiveBehavior ? undefined : startIcon}
            endIcon={usingResponsiveBehavior ? undefined : endIcon}
            onClick={handleClick}
            ownerState={ownerState}
            {...loadingFeedbackStateProps}
            {...restProps}
            {...slotProps?.root}
        >
            {usingResponsiveBehavior ? responsiveBehaviorSettings.mobileIcon : children}
        </Root>
    );

    const buttonNodeWithResponsiveBehavior = usingResponsiveBehavior ? (
        <MobileTooltip title={children} {...slotProps?.mobileTooltip}>
            {buttonNode}
        </MobileTooltip>
    ) : (
        buttonNode
    );

    return (
        <SuccessFeedback
            open={feedbackState === "success"}
            variant="success"
            placement="top-start"
            title={feedbackBehaviorSettings.successMessage}
            {...slotProps?.successFeedback}
        >
            <ErrorFeedback
                open={feedbackState === "error"}
                variant="error"
                placement="top-start"
                title={feedbackBehaviorSettings.errorMessage}
                {...slotProps?.errorFeedback}
            >
                <span>{buttonNodeWithResponsiveBehavior}</span>
            </ErrorFeedback>
        </SuccessFeedback>
    );
};

const Root = createComponentSlot(MuiButton)<ButtonClassKey, OwnerState>({
    componentName: "Button",
    slotName: "root",
    classesResolver(ownerState) {
        return [
            ownerState.usingResponsiveBehavior && "usingResponsiveBehavior",
            ownerState.feedbackState === "loading" && "feedbackStateLoading",
            ownerState.feedbackState === "success" && "feedbackStateSuccess",
            ownerState.feedbackState === "error" && "feedbackStateError",
        ];
    },
})(
    ({ ownerState }) => css`
        ${ownerState.usingResponsiveBehavior &&
        css`
            min-width: 0;
        `}
    `,
);

const MobileTooltip = createComponentSlot(Tooltip)<ButtonClassKey>({
    componentName: "Button",
    slotName: "mobileTooltip",
})();

const SuccessFeedback = createComponentSlot(Tooltip)<ButtonClassKey>({
    componentName: "Button",
    slotName: "successFeedback",
})();

const ErrorFeedback = createComponentSlot(Tooltip)<ButtonClassKey>({
    componentName: "Button",
    slotName: "errorFeedback",
})();

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminButton: ButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminButton: ButtonProps;
    }

    interface Components {
        CometAdminButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminButton"];
        };
    }
}
