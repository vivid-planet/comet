import { createElement } from "react";
import { FormRenderProps, RenderableProps } from "react-final-form";

// Render children like final-form does.
export function renderComponent<FormValues, InitialFormValues = Partial<FormValues>>(
    props: RenderableProps<FormRenderProps<FormValues, InitialFormValues>>,
    formRenderProps: FormRenderProps<FormValues, InitialFormValues>,
) {
    const { render, children, component } = props; // not using this.props as final-form-render-component does also use function-parameters and this solves "multiple implementations" hint
    if (component) {
        return createElement<FormRenderProps<FormValues, InitialFormValues> & RenderableProps<FormRenderProps<FormValues, InitialFormValues>>>(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            component,
            { ...formRenderProps, render },
            children,
        );
    }
    if (render) {
        return render(children === undefined ? formRenderProps : ({ ...formRenderProps, children } as any)); // inject children back in
    }
    if (typeof children !== "function") {
        return children;
    }
    return children(formRenderProps);
}
