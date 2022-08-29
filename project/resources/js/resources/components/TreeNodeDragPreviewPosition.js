import React from "react";

import utils from "../../utils/Utils";

const TreeNodeDragPreviewPosition = ({ monitorProps }) => {
    return (
        <div className="node-drag">
            <div className="label">
                <span>{utils.en2faDigits(monitorProps.item.text)}</span>
            </div>
        </div>
    );
};

export default TreeNodeDragPreviewPosition;
