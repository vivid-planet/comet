import classNames from "classnames";

import { type OverlayElementData } from "./IFrameBridge";
import styles from "./PreviewOverlayElement.module.css";
import { useIFrameBridge } from "./useIFrameBridge";

type Props = {
    element: OverlayElementData;
};

export const PreviewOverlayElement = ({ element }: Props) => {
    const iFrameBridge = useIFrameBridge();

    const isSelected = element.adminRoute === iFrameBridge.selectedAdminRoute;
    const isHovered = element.adminRoute === iFrameBridge.hoveredAdminRoute;

    return (
        <div
            key={element.adminRoute}
            className={classNames(styles.root, {
                [styles.showBlockOutlines]: iFrameBridge.showOutlines && !isHovered,
                [styles.blockIsSelected]: isSelected,
                [styles.isHoveredInBlockList]: isHovered,
            })}
            title={element.label}
            onClick={() => {
                iFrameBridge.sendSelectComponent(element.adminRoute);
            }}
            onMouseEnter={() => {
                iFrameBridge.sendHoverComponent(element.adminRoute);
            }}
            onMouseLeave={() => {
                iFrameBridge.sendHoverComponent(null);
            }}
            style={element.position}
        >
            <div className={styles.label}>{element.label}</div>
        </div>
    );
};
