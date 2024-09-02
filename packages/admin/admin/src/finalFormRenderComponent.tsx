import { createElement } from "react";
import { FormRenderProps, RenderableProps } from "react-final-form";

// Render children like final-form does.
export function renderComponent<T>(props: RenderableProps<FormRenderProps<T>>, formRenderProps: FormRenderProps<T>) {
    const { render, children, component } = props; // not using this.props as final-form-render-component does also use function-parameters and this solves "multiple implementations" hint
    if (component) {
        return createElement<FormRenderProps<T> & RenderableProps<FormRenderProps<T>>>(component, { ...formRenderProps, render }, children);
    }
    if (render) {
        return render(children === undefined ? formRenderProps : ({ ...formRenderProps, children } as any)); // inject children back in
    }
    if (typeof children !== "function") {
        return children;
    }
    return children(formRenderProps);
}
