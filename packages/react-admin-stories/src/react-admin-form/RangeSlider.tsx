import { storiesOf } from "@storybook/react";
import { Field, RangeSlider } from "@vivid-planet/react-admin-form";
import * as React from "react";
import { Form } from "react-final-form";
import styled from "styled-components";

const SliderWrapper = styled.div`
    padding: 0 20px;
`;

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
    line-height: 90px;
    width: 150px;

    input {
        text-align: center;
    }
`;

const ThumbComponent: React.FunctionComponent = props => {
    return <Thumb {...props} />;
};

function Story() {
    return (
        <div style={{ width: "300px" }}>
            <Form
                onSubmit={values => {
                    // values
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Field
                            name="facets"
                            component={RangeSlider}
                            rangeValues={{ min: 0, max: 100 }}
                            fieldContainerComponent={SliderWrapper}
                            rangeSliderType={"price"}
                            handleSubmit={handleSubmit}
                            thumb={ThumbComponent}
                            components={{
                                inputFieldContainer: InputFieldContainer,
                            }}
                        />
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("react-admin-form", module).add("React Slider", () => <Story />);
