import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
    Tree,
    getBackendOptions,
    MultiBackend,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Page } from "../_layout";
import { Service as Entity } from "../../../http/entities";
import { servicesPage as strings, general } from "../../../constants/strings";
import { TreeNodeDragPreviewService, TreeNodeService } from "../../components";
import { addServiceSchema, editServiceSchema } from "../../validations";
import {
    MESSAGE_TYPES,
    MESSAGE_CODES,
    UPLOADED_FILE,
    basePath,
} from "../../../constants";
import {
    setLoadingAction,
    setTitleAction,
} from "../../../state/layout/layoutActions";
import {
    clearMessageAction,
    setMessageAction,
} from "../../../state/message/messageActions";
import utils from "../../../utils/Utils";

const Services = () => {
    const dispatch = useDispatch();
    const layoutState = useSelector((state) => state.layoutReducer);
    let entity = new Entity();
    const navigate = useNavigate();
    const [items, setItems] = useState(null);
    const [item, setItem] = useState(null);
    const [action, setAction] = useState(null);
    const [treeData, setTreeData] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [addModal, setAddModal] = useState(null);
    const [editModal, setEditModal] = useState(null);
    const [removeModal, setRemoveModal] = useState(null);
    const [addError, setAddError] = useState(null);
    const [editError, setEditError] = useState(null);
    const [file, setFile] = useState(null);
    const [isCurrent, setIsCurrent] = useState(true);
    const {
        register: addRegister,
        formState: { errors: addErrors },
        reset: resetAdd,
        handleSubmit: handleAddSubmit,
        clearErrors: resetAddErrors,
    } = useForm({
        resolver: yupResolver(addServiceSchema),
    });
    const {
        register: editRegister,
        formState: { errors: editErrors },
        reset: resetEdit,
        setValue: setEditValue,
        handleSubmit: handleEditSubmit,
        clearErrors: resetEditErrors,
    } = useForm({
        resolver: yupResolver(editServiceSchema),
    });
    const { handleSubmit: handleRemoveSubmit, clearErrors: resetRemoveErrors } =
        useForm();

    const handleSelect = (node) => setSelectedNode(node);
    const handleDrop = (newTree, callback) => {
        const { dragSourceId, dropTargetId } = callback;

        onSetParentSubmit(dragSourceId, dropTargetId);
    };

    const fetchServices = async (data = null) => {
        let result = await entity.getAll(data?.title);

        if (result === null) {
            setItems(null);
            dispatch(
                setMessageAction(
                    entity.errorMessage,
                    MESSAGE_TYPES.ERROR,
                    entity.errorCode
                )
            );

            return;
        }

        setItems(result.items);
    };

    const makeTreeData = (treeItems) => {
        let treeDataItems = null;

        if (treeItems && treeItems?.length > 0) {
            treeDataItems = [];

            treeItems.forEach((treeItem) => {
                treeDataItems.push({
                    id: treeItem.id,
                    parent: treeItem.parentId,
                    droppable: true,
                    text: treeItem.title,
                    image: treeItem.image,
                });
            });
        }

        setTreeData(treeDataItems);
    };

    const fillForm = async (data = null) => {
        dispatch(setLoadingAction(true));

        await fetchServices(data);

        dispatch(setLoadingAction(false));
    };

    const onAdd = () => {
        setItem(selectedNode?.id ?? 0);
        setAction("ADD");
    };

    const onAddIcon = (id) => {
        setItem(id);
        setAction("ADD");
    };

    const onEdit = (id) => {
        setItem(id);
        setAction("EDIT");
    };

    const onRemove = (id) => {
        setItem(id);
        setAction("REMOVE");
    };

    const onUpPriority = (id) => {
        setItem(id);
        setAction("UP_PRIORITY");
    };

    const onDownPriority = (id) => {
        setItem(id);
        setAction("DOWN_PRIORITY");
    };

    const onPosts = (id) => {
        setItem(id);
        setAction("POSTS");
    };

    const addService = async () => {
        dispatch(setLoadingAction(true));

        if (!isNaN(item) && item > 0) {
            let result = await entity.get(item);

            if (result === null) {
                dispatch(
                    setMessageAction(
                        entity.errorMessage,
                        MESSAGE_TYPES.ERROR,
                        entity.errorCode
                    )
                );

                return;
            }

            setItem(result?.item);
        }

        addModal?.show();

        dispatch(setLoadingAction(false));
    };

    const editService = async () => {
        dispatch(setLoadingAction(true));

        let result = await entity.get(item);

        if (result === null) {
            dispatch(
                setMessageAction(
                    entity.errorMessage,
                    MESSAGE_TYPES.ERROR,
                    entity.errorCode
                )
            );

            return;
        }

        setItem(result?.item);
        setEditValue("title", result.item.title);
        editModal?.show();

        dispatch(setLoadingAction(false));
    };

    const removeService = async () => {
        dispatch(setLoadingAction(true));

        let result = await entity.get(item);

        if (result === null) {
            dispatch(
                setMessageAction(
                    entity.errorMessage,
                    MESSAGE_TYPES.ERROR,
                    entity.errorCode
                )
            );

            return;
        }

        setItem(result?.item);
        removeModal?.show();

        dispatch(setLoadingAction(false));
    };

    const showPosts = async () => {
        navigate(`${basePath}/posts/${item}`);
    };

    useEffect(() => {
        makeTreeData(items);
    }, [items]);

    useEffect(() => {
        if (action) {
            if (action === "ADD" && !isNaN(item)) {
                addService();
            } else if (action === "EDIT" && !isNaN(item)) {
                editService();
            } else if (action === "REMOVE" && !isNaN(item)) {
                removeService();
            } else if (action === "UP_PRIORITY" && !isNaN(item)) {
                onUpPrioritySubmit();
            } else if (action === "DOWN_PRIORITY" && !isNaN(item)) {
                onDownPrioritySubmit();
            } else if (action === "POSTS" && !isNaN(item)) {
                showPosts();
            }
        }
    }, [action]);

    useEffect(() => {
        const hasKeys = !!Object.keys(addErrors).length;

        if (hasKeys) {
            setAddError({
                code: MESSAGE_CODES.FORM_INPUT_INVALID,
                type: Object.keys(addErrors)[0],
                message: addErrors[Object.keys(addErrors)[0]].message,
            });
        }
    }, [addErrors]);

    useEffect(() => {
        const hasKeys = !!Object.keys(editErrors).length;

        if (hasKeys) {
            setEditError({
                code: MESSAGE_CODES.FORM_INPUT_INVALID,
                type: Object.keys(editErrors)[0],
                message: editErrors[Object.keys(editErrors)[0]].message,
            });
        }
    }, [editErrors]);

    useEffect(() => {
        dispatch(setTitleAction(strings._title));

        fillForm();

        const addModalElement = document.getElementById("addModal");
        const editModalElement = document.getElementById("editModal");
        const removeModalElement = document.getElementById("removeModal");

        if (addModalElement) {
            let m = new coreui.Modal(addModalElement);
            addModalElement.addEventListener("hidden.coreui.modal", () => {
                reset();
            });
            setAddModal(m);
        }

        if (editModalElement) {
            let m = new coreui.Modal(editModalElement);
            editModalElement.addEventListener("hidden.coreui.modal", () => {
                reset();
            });
            setEditModal(m);
        }

        if (removeModalElement) {
            let m = new coreui.Modal(removeModalElement);
            removeModalElement.addEventListener("hidden.coreui.modal", () => {
                reset();
            });
            setRemoveModal(m);
        }

        return () => {
            setIsCurrent(false);
        };
    }, []);

    const reset = () => {
        addModal?.hide();
        editModal?.hide();
        removeModal?.hide();
        setItem(null);
        setFile(null);
        setAction(null);
        resetAdd({ title: "" });
        resetEdit({ title: "" });
        setAddError(null);
        setEditError(null);
        resetAddErrors();
        resetEditErrors();
        resetRemoveErrors();
        window.scrollTo(0, 0);
    };

    const onAddSubmit = async (data) => {
        dispatch(setLoadingAction(true));
        dispatch(clearMessageAction());

        let result = await entity.store(item?.id, data.title, file);

        if (result === null) {
            dispatch(setLoadingAction(false));
            dispatch(
                setMessageAction(
                    entity.errorMessage,
                    MESSAGE_TYPES.ERROR,
                    entity.errorCode
                )
            );

            return;
        }

        if (
            file &&
            (!result?.uploaded || result?.uploaded !== UPLOADED_FILE.OK)
        ) {
            setLoadingAction(false);
            dispatch(
                setMessageAction(
                    result?.uploadedText,
                    MESSAGE_TYPES.ERROR,
                    result?.uploaded,
                    true,
                    "image"
                )
            );

            return;
        }

        dispatch(
            setMessageAction(
                strings.addSubmitted,
                MESSAGE_TYPES.SUCCESS,
                MESSAGE_CODES.OK
            )
        );

        reset();
        await fetchServices();

        dispatch(setLoadingAction(false));
    };

    const onEditSubmit = async (data) => {
        if (isNaN(item?.id)) {
            return;
        }

        dispatch(setLoadingAction(true));
        dispatch(clearMessageAction());

        let result = await entity.update(item?.id, data.title, file);

        if (result === null) {
            dispatch(setLoadingAction(false));
            dispatch(
                setMessageAction(
                    entity.errorMessage,
                    MESSAGE_TYPES.ERROR,
                    entity.errorCode
                )
            );

            return;
        }

        if (
            file &&
            (!result?.uploaded || result?.uploaded !== UPLOADED_FILE.OK)
        ) {
            setLoadingAction(false);
            dispatch(
                setMessageAction(
                    result?.uploadedText,
                    MESSAGE_TYPES.ERROR,
                    result?.uploaded,
                    true,
                    "image"
                )
            );

            return;
        }

        dispatch(
            setMessageAction(
                strings.editSubmitted,
                MESSAGE_TYPES.SUCCESS,
                MESSAGE_CODES.OK
            )
        );

        reset();
        await fetchServices();

        dispatch(setLoadingAction(false));
    };

    const onRemoveSubmit = async () => {
        if (isNaN(item?.id)) {
            return;
        }

        dispatch(setLoadingAction(true));
        dispatch(clearMessageAction());

        let result = await entity.remove(item?.id);

        if (result === null) {
            dispatch(setLoadingAction(false));
            dispatch(
                setMessageAction(
                    entity.errorMessage,
                    MESSAGE_TYPES.ERROR,
                    entity.errorCode
                )
            );

            return;
        }

        dispatch(
            setMessageAction(
                strings.serviceRemoved,
                MESSAGE_TYPES.SUCCESS,
                MESSAGE_CODES.OK
            )
        );

        reset();
        await fetchServices();

        dispatch(setLoadingAction(false));
    };

    const onUpPrioritySubmit = async () => {
        dispatch(setLoadingAction(true));
        dispatch(clearMessageAction());

        let result = await entity.upPriority(item);

        if (result === null) {
            dispatch(setLoadingAction(false));
            dispatch(
                setMessageAction(
                    entity.errorMessage,
                    MESSAGE_TYPES.ERROR,
                    entity.errorCode
                )
            );

            return;
        }

        reset();
        await fetchServices();

        dispatch(setLoadingAction(false));
    };

    const onDownPrioritySubmit = async () => {
        dispatch(setLoadingAction(true));
        dispatch(clearMessageAction());

        let result = await entity.downPriority(item);

        if (result === null) {
            dispatch(setLoadingAction(false));
            dispatch(
                setMessageAction(
                    entity.errorMessage,
                    MESSAGE_TYPES.ERROR,
                    entity.errorCode
                )
            );

            return;
        }

        reset();
        await fetchServices();

        dispatch(setLoadingAction(false));
    };

    const onSetParentSubmit = async (id, parentId) => {
        dispatch(setLoadingAction(true));
        dispatch(clearMessageAction());

        let result = await entity.setParent(id, parentId);

        if (result === null) {
            dispatch(setLoadingAction(false));
            dispatch(
                setMessageAction(
                    entity.errorMessage,
                    MESSAGE_TYPES.ERROR,
                    entity.errorCode
                )
            );

            return;
        }

        reset();
        await fetchServices();

        dispatch(setLoadingAction(false));
    };

    const onChangeFile = (e) => {
        const image = e?.target?.files[0];

        if (image) {
            setFile(image);
        }
    };

    const renderAddFileRow = (field) => (
        <div className="col-12 pb-4">
            <label className="form-label" htmlFor={field}>
                {strings[field]}
            </label>
            <input
                {...addRegister(`${field}`)}
                className={
                    addError?.type === field
                        ? "form-control is-invalid"
                        : "form-control"
                }
                id={field}
                disabled={layoutState?.loading}
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={(e) => onChangeFile(e)}
            />
            {addError?.type === field && (
                <div className="invalid-feedback">{addError?.message}</div>
            )}
        </div>
    );

    const renderEditFileRow = (field) => (
        <div className="col-12 pb-4">
            <label className="form-label" htmlFor={field}>
                {strings[field]}
            </label>
            <input
                {...editRegister(`${field}`)}
                className={
                    editError?.type === field
                        ? "form-control is-invalid"
                        : "form-control"
                }
                id={field}
                disabled={layoutState?.loading}
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={(e) => onChangeFile(e)}
            />
            {editError?.type === field && (
                <div className="invalid-feedback">{editError?.message}</div>
            )}
        </div>
    );

    const renderTextRow = (field) => {
        return (
            <div className="col-12">
                <label className="form-label" htmlFor={field}>
                    {strings[field]}
                </label>
                <p>{item?.title ?? "----"}</p>
                {addError?.type === field && (
                    <div className="invalid-feedback">
                        {addError?.message ?? editError?.message}
                    </div>
                )}
            </div>
        );
    };

    const renderAddInputRow = (field, type = "text", placeholder = null) => {
        placeholder = placeholder
            ? placeholder
            : strings[`${field}Placeholder`];

        return (
            <div className="col-12 pb-4">
                <label className="form-label" htmlFor={field}>
                    {strings[field]}
                </label>
                <input
                    {...addRegister(field)}
                    className={
                        addError?.type === field
                            ? "form-control is-invalid"
                            : "form-control"
                    }
                    id={field}
                    placeholder={placeholder}
                    disabled={layoutState?.loading}
                    type={type}
                />
                {addError?.type === field && (
                    <div className="invalid-feedback">{addError?.message}</div>
                )}
            </div>
        );
    };

    const renderEditInputRow = (field, type = "text", placeholder = null) => {
        placeholder = placeholder
            ? placeholder
            : strings[`${field}Placeholder`];

        return (
            <div className="col-12 pb-4">
                <label className="form-label" htmlFor={field}>
                    {strings[field]}
                </label>
                <input
                    {...editRegister(field)}
                    className={
                        editError?.type === field
                            ? "form-control is-invalid"
                            : "form-control"
                    }
                    id={field}
                    placeholder={placeholder}
                    disabled={layoutState?.loading}
                    type={type}
                />
                {editError?.type === field && (
                    <div className="invalid-feedback">{editError?.message}</div>
                )}
            </div>
        );
    };

    const renderAddModal = () => (
        <div
            className="modal fade"
            id="addModal"
            tabIndex={"-1"}
            aria-labelledby="addModal"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addModalCenterTitle">
                            {strings.addService}
                        </h5>
                        <button
                            className="btn-close"
                            type="button"
                            data-coreui-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">{renderAddInputRow("title")}</div>
                        <div className="row">{renderAddFileRow("image")}</div>
                        <div className="row">{renderTextRow("parentId")}</div>
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-success"
                            type="button"
                            onClick={handleAddSubmit(onAddSubmit)}
                        >
                            {general.submit}
                        </button>
                        <button
                            className="btn btn-secondary"
                            type="button"
                            data-coreui-dismiss="modal"
                        >
                            {general.cancel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEditModal = () => (
        <div
            className="modal fade"
            id="editModal"
            tabIndex={"-1"}
            aria-labelledby="editModal"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="editModalCenterTitle">
                            {`${strings.editService} - [ ${utils.en2faDigits(
                                item?.title
                            )} ]`}
                        </h5>
                        <button
                            className="btn-close"
                            type="button"
                            data-coreui-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">{renderEditInputRow("title")}</div>
                        <div className="row">{renderEditFileRow("image")}</div>
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-success"
                            type="button"
                            onClick={handleEditSubmit(onEditSubmit)}
                        >
                            {general.submit}
                        </button>
                        <button
                            className="btn btn-secondary"
                            type="button"
                            data-coreui-dismiss="modal"
                        >
                            {general.cancel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRemoveModal = () => (
        <div
            className="modal fade"
            id="removeModal"
            tabIndex={"-1"}
            aria-labelledby="removeModal"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5
                            className="modal-title"
                            id="exampleModalCenterTitle"
                        >
                            {`${
                                strings.removeServiceModalTitle
                            } - [ ${utils.en2faDigits(item?.title)} ]`}
                        </h5>
                        <button
                            className="btn-close"
                            type="button"
                            data-coreui-dismiss="modal"
                            aria-label="Close"
                            disabled={layoutState?.loading}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <p className="mb-0 text-center">
                            {strings.removeServiceModalBody1}
                        </p>
                        <p className="mb-0 text-center">
                            {strings.removeServiceModalBody2}
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleRemoveSubmit(onRemoveSubmit)}
                            disabled={layoutState?.loading}
                        >
                            {general.yes}
                        </button>
                        <button
                            className="btn btn-secondary"
                            type="button"
                            data-coreui-dismiss="modal"
                        >
                            {general.no}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!isCurrent) <></>;

    return (
        <Page page={"Services"}>
            <div className="row mb-2">
                <div className="col-sm-12">
                    <button
                        className="btn btn-success px-4"
                        type="button"
                        title={strings.addService}
                        onClick={onAdd}
                        disabled={layoutState?.loading}
                    >
                        {strings.addService}
                    </button>
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-sm-12 my-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            {treeData && treeData?.length > 0 && (
                                <DndProvider
                                    backend={MultiBackend}
                                    options={getBackendOptions()}
                                >
                                    <Tree
                                        tree={treeData}
                                        rootId={0}
                                        sort={false}
                                        insertDroppableFirst={false}
                                        render={(
                                            node,
                                            { depth, isOpen, onToggle }
                                        ) => (
                                            <TreeNodeService
                                                node={node}
                                                depth={depth}
                                                isOpen={isOpen}
                                                isSelected={
                                                    node.id === selectedNode?.id
                                                }
                                                onToggle={onToggle}
                                                onSelect={handleSelect}
                                                onAdd={onAddIcon}
                                                onEdit={onEdit}
                                                onRemove={onRemove}
                                                onUpPriority={onUpPriority}
                                                onDownPriority={onDownPriority}
                                                onPosts={onPosts}
                                            />
                                        )}
                                        dragPreviewRender={(monitorProps) => (
                                            <TreeNodeDragPreviewService
                                                monitorProps={monitorProps}
                                            />
                                        )}
                                        classes={{
                                            draggingSource: "dragging-source",
                                            dropTarget: "drop-target",
                                        }}
                                        onDrop={handleDrop}
                                    />
                                </DndProvider>
                            )}
                            {(!treeData || treeData?.length === 0) && (
                                <p>{general.noDataFound}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {renderAddModal()}
            {renderEditModal()}
            {renderRemoveModal()}
        </Page>
    );
};

export default Services;
