import { SvgIcon, SvgIconProps } from "@mui/material";
import { forwardRef } from "react";

const YouTube = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
    return (
        <SvgIcon {...props} ref={ref} viewBox="0 0 16 16">
            <path
                d="M0.123279 4.7738C0.199562 3.53162 1.20016 2.5573 2.44329 2.49845C4.07066 2.4214 6.30232 2.33331 8.00004 2.33331C9.6981 2.33331 11.9303 2.42143 13.5578 2.49849C14.8005 2.55734 15.801 3.53063 15.8778 4.77237C15.9413 5.79774 16 7.00601 16 7.96806C16 8.93012 15.9413 10.1384 15.8778 11.1638C15.801 12.4055 14.8005 13.3788 13.5578 13.4376C11.9303 13.5147 9.6981 13.6028 8.00004 13.6028C6.30157 13.6028 4.06866 13.5147 2.44111 13.4376C1.19891 13.3788 0.198581 12.4063 0.121035 11.1651C0.0593843 10.1784 0.00256505 9.02723 8.72503e-05 8.10719C-0.00261709 7.10304 0.0579651 5.83734 0.123279 4.7738Z"
                fill="#FF0000"
            />
            <path d="M10.5739 7.96809L6.50431 10.3176L6.50431 5.61854L10.5739 7.96809Z" fill="white" />
        </SvgIcon>
    );
});

export default YouTube;