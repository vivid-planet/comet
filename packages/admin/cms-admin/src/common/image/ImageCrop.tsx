import isEqual from "lodash.isequal";
import * as React from "react";
import { Field, useForm, useFormState } from "react-final-form";
import ReactCrop, { ReactCropProps } from "react-image-crop";

import { EditImageFormValues } from "../../dam/FileForm/EditFile";
import { GQLFocalPoint } from "../../graphql.generated";
import * as sc from "./ImageCrop.sc";

const focalPoints: GQLFocalPoint[] = ["CENTER", "NORTHEAST", "NORTHWEST", "SOUTHEAST", "SOUTHWEST"];

type ImageCropProps = Pick<ReactCropProps, "src" | "imageStyle" | "disabled">;

const clipValue = (value?: number) => {
    return value === undefined ? undefined : Math.max(0, Math.min(100, value));
};

export const ImageCrop = (props: ImageCropProps): React.ReactElement => {
    const form = useForm<EditImageFormValues>();
    const {
        values: { focalPoint },
    } = useFormState<EditImageFormValues>();

    const disabled = props.disabled === true || focalPoint === "SMART";

    const handleFocalPointChange = (newFocalPoint: GQLFocalPoint) => {
        form.change("focalPoint", newFocalPoint);
    };

    return (
        <Field name="crop" isEqual={isEqual}>
            {({ input: { value, onChange } }) => (
                <sc.ImageContainer>
                    <ReactCrop
                        {...props}
                        crop={disabled ? {} : { ...value, unit: "%" }}
                        ruleOfThirds={true}
                        disabled={disabled}
                        onChange={(newCrop, percentCrop) => {
                            // Prevent reset at first rendering
                            if (percentCrop.width === 0 && percentCrop.height === 0 && percentCrop.x === 0 && percentCrop.y === 0) {
                                return;
                            }

                            onChange({
                                x: clipValue(percentCrop.x),
                                y: clipValue(percentCrop.y),
                                width: clipValue(percentCrop.width),
                                height: clipValue(percentCrop.height),
                            });
                        }}
                        renderSelectionAddon={() => {
                            return (
                                <>
                                    {focalPoints.map((point) => (
                                        <sc.FocalPointHandle
                                            key={point}
                                            point={point}
                                            selected={point === focalPoint}
                                            type="button"
                                            onClick={() => handleFocalPointChange(point)}
                                        />
                                    ))}
                                </>
                            );
                        }}
                    />
                </sc.ImageContainer>
            )}
        </Field>
    );
};
