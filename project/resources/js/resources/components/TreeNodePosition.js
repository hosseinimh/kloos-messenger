import React, { useState } from "react";
import { useSelector } from "react-redux";

import { vendorsPath } from "../../constants";
import { general } from "../../constants/strings";
import utils from "../../utils/Utils";

const TreeNodePosition = ({
    node,
    depth,
    isOpen,
    isSelected,
    onToggle,
    onSelect,
    onAdd,
    onEdit,
    onRemove,
    onUpPriority,
    onDownPriority,
}) => {
    const indent = depth * 24;
    const [hover, setHover] = useState(false);
    const layoutState = useSelector((state) => state.layoutReducer);

    const handleToggle = (e) => {
        e.stopPropagation();
        onToggle(node.id);
    };

    const handleSelect = () => !layoutState?.loading && onSelect(node);
    const handleAdd = () => !layoutState?.loading && onAdd(node?.id);
    const handleEdit = () => !layoutState?.loading && onEdit(node?.id);
    const handleRemove = () => !layoutState?.loading && onRemove(node?.id);
    const handleUpPriority = () =>
        !layoutState?.loading && onUpPriority(node?.id);
    const handleDownPriority = () =>
        !layoutState?.loading && onDownPriority(node?.id);

    return (
        <div
            className={`tree-node ${isSelected ? "is-selected" : ""} ${
                hover ? "hover" : ""
            }`}
            style={{ paddingInlineStart: indent }}
            onClick={handleSelect}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className={`expand-icon-wrapper ${isOpen ? "is-open" : ""}`}>
                {node.droppable && (
                    <div onClick={handleToggle}>
                        <svg className="arrow-icon">
                            <use
                                xlinkHref={`${vendorsPath}/@coreui/icons/svg/solid.svg#cis-chevron-left-alt`}
                            ></use>
                        </svg>
                    </div>
                )}
            </div>
            <div className="label-item">
                <span>{utils.en2faDigits(node.text)}</span>
            </div>
            {hover && (
                <>
                    <div
                        className="action-button mr-5"
                        onClick={handleAdd}
                        title={general.add}
                    >
                        <svg className="action-icon">
                            <use
                                xlinkHref={`${vendorsPath}/@coreui/icons/svg/linear.svg#cil-plus-square`}
                            ></use>
                        </svg>
                    </div>
                    <div
                        className="action-button mr-2"
                        onClick={handleEdit}
                        title={general.edit}
                    >
                        <svg className="action-icon">
                            <use
                                xlinkHref={`${vendorsPath}/@coreui/icons/svg/linear.svg#cil-pencil`}
                            ></use>
                        </svg>
                    </div>
                    <div
                        className="action-button mr-2"
                        onClick={handleRemove}
                        title={general.remove}
                    >
                        <svg className="action-icon">
                            <use
                                xlinkHref={`${vendorsPath}/@coreui/icons/svg/linear.svg#cil-trash-x`}
                            ></use>
                        </svg>
                    </div>
                    <div
                        className="action-button mr-2"
                        onClick={handleDownPriority}
                        title={general.down}
                    >
                        <svg className="action-icon">
                            <use
                                xlinkHref={`${vendorsPath}/@coreui/icons/svg/linear.svg#cil-chevron-bottom-alt`}
                            ></use>
                        </svg>
                    </div>
                    <div
                        className="action-button mr-2"
                        onClick={handleUpPriority}
                        title={general.up}
                    >
                        <svg className="action-icon">
                            <use
                                xlinkHref={`${vendorsPath}/@coreui/icons/svg/linear.svg#cil-chevron-top-alt`}
                            ></use>
                        </svg>
                    </div>
                </>
            )}
        </div>
    );
};

export default TreeNodePosition;
