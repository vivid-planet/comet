import { Field, RangeSlider } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";
import styled from "styled-components";

const Thumb = styled.div`
    && {
        margin-top: -9px;
        height: 20px;
        width: 20px;

        &:hover {
            box-shadow: none;
        }

        &:after {
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(-45deg);
            display: inline-block;
            position: relative;
            padding: 2px;
            content: "";
            left: -1px;
            top: 0;
        }

        &[data-index="1"] {
            &:after {
                transform: rotate(135deg);
                left: 1px;
            }
        }
    }
`;

const InputFieldContainer = styled.div`
    text-align: center;

    input {
        text-align: center;
        min-width: 50px;
    }
`;

const ThumbComponent: React.FunctionComponent = (props) => {
    return <Thumb {...props} />;
};

function Story() {
    return (
        <div style={{ width: "300px" }}>
            <Form
                onSubmit={(values) => {
                    // values
                }}
                initialValues={{ price: { min: 0, max: 100 } }}
                render={({ handleSubmit, values }) => (
                    <Field
                        component={RangeSlider}
                        name="price"
                        min={0}
                        max={100}
                        thumb={ThumbComponent}
                        endAdornment={<span>€</span>}
                        components={{
                            inputFieldContainer: InputFieldContainer,
                        }}
                    />
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("Range Slider", () => <Story />);
