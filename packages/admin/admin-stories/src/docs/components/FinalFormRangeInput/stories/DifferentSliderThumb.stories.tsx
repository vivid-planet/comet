import { Field, FinalFormRangeInput } from "@comet/admin";
import { styled } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Final Form Range Input/Different Slider Thumb", module).add("Different Slider Thumb", () => {
    const Thumb = styled("div")`
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

    return (
        <>
            <Form
                onSubmit={(values) => {
                    // values
                }}
                render={({ handleSubmit, values, form, initialValues }) => (
                    <Field component={FinalFormRangeInput} name="price" min={0} max={100} sliderProps={{ ThumbComponent: Thumb }} />
                )}
            />
        </>
    );
});
