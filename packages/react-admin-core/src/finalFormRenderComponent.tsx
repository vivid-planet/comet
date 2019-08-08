import * as React from "react";
import { AnyObject, FormRenderProps, RenderableProps } from "react-final-form";

// call to render-children consists of ...rest, ...renderProps, __versions, see https://github.com/final-form/react-final-form/blob/master/src/ReactFinalForm.js#L195
// whereby ...rest is FormProps destructed with all Config attributes and FormProps specific attributes, see https://github.com/final-form/react-final-form/blob/master/src/ReactFinalForm.js#L42
// which left RenderableProps in ...rest. (click FormProps and check extends). But they are missing in FormRenderProps-Type
export type CorrectFormRenderProps<FormValues = AnyObject> = FormRenderProps<FormValues> & RenderableProps<FormRenderProps<FormValues>>;

// Render children like final-form does.
export function renderComponent<T>(formRenderProps: CorrectFormRenderProps<T>) {
    const { render, children, component } = formRenderProps; // not using this.props as final-form-render-component does also use function-parameters and this solves "multiple implementations" hint
    if (component) {
        return React.createElement<CorrectFormRenderProps<T>>(component, { ...formRenderProps, children, render });
    }
    if (render) {
        return render(children === undefined ? formRenderProps : { ...formRenderProps, children }); // inject children back in
    }
    if (typeof children !== "function") {
        return children;
    }
    return children(formRenderProps);
}
