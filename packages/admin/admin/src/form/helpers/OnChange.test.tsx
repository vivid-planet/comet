// Copied from https://github.com/final-form/react-final-form-listeners/blob/master/src/OnChange.test.js
import { cleanup, fireEvent, render } from "@testing-library/react";
import React from "react";
import { Field, Form } from "react-final-form";

import { OnChange } from "./OnChange";

const onSubmitMock = () => {
    // Noop
};

describe("OnChange", () => {
    afterEach(cleanup);

    it("should not call listener on first render", () => {
        const spy = jest.fn();
        render(
            <Form onSubmit={onSubmitMock} initialValues={{ foo: "bar" }}>
                {() => <OnChange name="foo">{spy}</OnChange>}
            </Form>,
        );
        expect(spy).not.toHaveBeenCalled();
    });

    it("should call listener when going from uninitialized to value", () => {
        const spy = jest.fn();
        const { getByTestId } = render(
            <Form onSubmit={onSubmitMock}>
                {() => (
                    <form>
                        <Field name="name" component="input" data-testid="name" />
                        <OnChange name="name">{spy}</OnChange>
                    </form>
                )}
            </Form>,
        );
        expect(spy).not.toHaveBeenCalled();
        fireEvent.change(getByTestId("name"), { target: { value: "erikras" } });
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("erikras", "");
    });

    it("should call listener when going from initialized to value", () => {
        const spy = jest.fn();
        const { getByTestId } = render(
            <Form onSubmit={onSubmitMock} initialValues={{ name: "erik" }}>
                {() => (
                    <form>
                        <Field name="name" component="input" data-testid="name" />
                        <OnChange name="name">{spy}</OnChange>
                    </form>
                )}
            </Form>,
        );
        expect(spy).not.toHaveBeenCalled();
        fireEvent.change(getByTestId("name"), { target: { value: "erikras" } });
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("erikras", "erik");
    });

    it("should call listener when changing to null", () => {
        const spy = jest.fn();
        const { getByTestId } = render(
            <Form onSubmit={onSubmitMock} initialValues={{ name: "erikras" }}>
                {() => (
                    <form>
                        <Field name="name" component="input" data-testid="name" />
                        <OnChange name="name">{spy}</OnChange>
                    </form>
                )}
            </Form>,
        );
        expect(spy).not.toHaveBeenCalled();
        fireEvent.change(getByTestId("name"), { target: { value: null } });
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("", "erikras");
    });

    it("should handle quick subsequent changes properly", () => {
        const toppings = ["Pepperoni", "Mushrooms", "Olives"];
        const { getByTestId } = render(
            <Form onSubmit={onSubmitMock}>
                {({ form }) => (
                    <React.Fragment>
                        <Field name="everything" component="input" type="checkbox" data-testid="everything" />
                        <OnChange name="everything">
                            {(next) => {
                                if (next) {
                                    return form.change("toppings", toppings);
                                }
                            }}
                        </OnChange>
                        {toppings.length > 0 &&
                            toppings.map((topping, index) => {
                                return (
                                    <Field component="input" key={topping} name="toppings" value={topping} type="checkbox" data-testid={topping} />
                                );
                            })}
                        <OnChange name="toppings">
                            {(next) => {
                                form.change("everything", next && next.length === toppings.length);
                            }}
                        </OnChange>
                    </React.Fragment>
                )}
            </Form>,
        );
        expect((getByTestId("everything") as HTMLInputElement).checked).toBe(false);
        expect((getByTestId("Pepperoni") as HTMLInputElement).checked).toBe(false);
        expect((getByTestId("Mushrooms") as HTMLInputElement).checked).toBe(false);
        expect((getByTestId("Olives") as HTMLInputElement).checked).toBe(false);

        fireEvent.click(getByTestId("Pepperoni"));
        expect((getByTestId("Pepperoni") as HTMLInputElement).checked).toBe(true);
        expect((getByTestId("everything") as HTMLInputElement).checked).toBe(false);

        fireEvent.click(getByTestId("Mushrooms"));
        expect((getByTestId("Mushrooms") as HTMLInputElement).checked).toBe(true);
        expect((getByTestId("everything") as HTMLInputElement).checked).toBe(false);

        fireEvent.click(getByTestId("Olives"));
        expect((getByTestId("Olives") as HTMLInputElement).checked).toBe(true);
        expect((getByTestId("everything") as HTMLInputElement).checked).toBe(true);

        fireEvent.click(getByTestId("Olives"));
        expect((getByTestId("Olives") as HTMLInputElement).checked).toBe(false);
        expect((getByTestId("everything") as HTMLInputElement).checked).toBe(false);

        fireEvent.click(getByTestId("everything"));
        expect((getByTestId("Pepperoni") as HTMLInputElement).checked).toBe(true);
        expect((getByTestId("Mushrooms") as HTMLInputElement).checked).toBe(true);
        expect((getByTestId("Olives") as HTMLInputElement).checked).toBe(true);
        expect((getByTestId("everything") as HTMLInputElement).checked).toBe(true);
    });
});
