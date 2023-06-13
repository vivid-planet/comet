type ConditionalWrapperProps = {
    condition: boolean;
    wrapper: (children: JSX.Element) => JSX.Element;
    children: JSX.Element;
};

export const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperProps) => {
    return condition ? wrapper(children) : children;
};
