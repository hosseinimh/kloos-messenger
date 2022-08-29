import React from "react";

import { vendorsPath } from "../../constants";
import utils from "../../utils/Utils";

const TreeNodeDragPreviewService = ({ monitorProps }) => {
    return (
        <div className="node-drag">
            <div>
                <svg className="node-icon">
                    <use
                        xlinkHref={`${vendorsPath}/@coreui/icons/svg/linear.svg#cil-image`}
                    ></use>
                </svg>
            </div>
            <div className="label">
                <span>{utils.en2faDigits(monitorProps.item.text)}</span>
            </div>
        </div>
    );
};

export default TreeNodeDragPreviewService;
