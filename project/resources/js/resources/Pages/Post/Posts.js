import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { Page } from "../_layout";
import { Post as Entity, Service } from "../../../http/entities";
import { postsPage as strings, general } from "../../../constants/strings";
import { Table } from "../../components";
import {
    MESSAGE_TYPES,
    MESSAGE_CODES,
    basePath,
    imgPath,
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
import { BsFillFileExcelFill, BsPencilFill } from "react-icons/bs";

const Posts = () => {
    const dispatch = useDispatch();
    const layoutState = useSelector((state) => state.layoutReducer);
    const navigate = useNavigate();
    let entity = new Entity();
    const columnsCount = 3;
    let { serviceId } = useParams();
    serviceId = parseInt(serviceId);
    const [items, setItems] = useState(null);
    const [item, setItem] = useState(null);
    const [service, setService] = useState(null);
    const [action, setAction] = useState(null);
    const [removeModal, setRemoveModal] = useState(null);
    const [isCurrent, setIsCurrent] = useState(true);
    const { handleSubmit: handleRemoveSubmit, clearErrors: resetRemoveErrors } =
        useForm();

    const fetchService = async () => {
        let srv = new Service();
        let result = await srv.get(serviceId);

        if (result === null) {
            dispatch(
                setMessageAction(
                    general.itemNotFound,
                    MESSAGE_TYPES.ERROR,
                    MESSAGE_CODES.ITEM_NOT_FOUND,
                    false
                )
            );
            navigate(`${basePath}/services`);

            return null;
        }

        setService(result.item);
        dispatch(
            setTitleAction(`${strings._title} [ ${result?.item?.title} ]`)
        );

        return result;
    };

    const fetchPosts = async (data = null) => {
        let result = await entity.getPagination(serviceId);

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

    const fillForm = async (data = null) => {
        dispatch(setLoadingAction(true));

        if (!(await fetchService(serviceId))) {
            return;
        }

        await fetchPosts(data);

        dispatch(setLoadingAction(false));
    };

    const onAdd = () => {
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

    const addPost = () => {
        navigate(`${basePath}/posts/add/${serviceId}`);
    };

    const editPost = () => {
        navigate(`${basePath}/posts/edit/${item}`);
    };

    const removePost = async () => {
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

    useEffect(() => {
        if (action) {
            if (action === "ADD") {
                addPost();
            } else if (action === "EDIT" && !isNaN(item)) {
                editPost();
            } else if (action === "REMOVE" && !isNaN(item)) {
                removePost();
            }
        }
    }, [action]);

    useEffect(() => {
        dispatch(setTitleAction(strings._title));

        if (isNaN(serviceId) || serviceId <= 0) {
            dispatch(
                setMessageAction(
                    general.itemNotFound,
                    MESSAGE_TYPES.ERROR,
                    MESSAGE_CODES.ITEM_NOT_FOUND,
                    false
                )
            );
            navigate(`${basePath}/services`);

            return;
        }

        fillForm();

        const removeModalElement = document.getElementById("removeModal");

        if (removeModalElement) {
            let m = new coreui.Modal(removeModalElement);
            removeModalElement.addEventListener("hidden.coreui.modal", () => {
                setItem(null);
                setAction(null);
                resetRemoveErrors();
            });
            setRemoveModal(m);
        }

        return () => {
            setIsCurrent(false);
        };
    }, []);

    const reset = () => {
        removeModal?.hide();
        setItem(null);
        setAction(null);
        resetRemoveErrors();
        window.scrollTo(0, 0);
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
        await fetchPosts();

        dispatch(setLoadingAction(false));
    };

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
                                strings.removePostModalTitle
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
                            {strings.removePostModalBody}
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

    const renderHeader = () => (
        <tr>
            <th scope="col" style={{ width: "50px" }}>
                #
            </th>
            <th scope="col">{strings.titleSummary}</th>
            <th scope="col" style={{ width: "150px", textAlign: "center" }}>
                {general.actions}
            </th>
        </tr>
    );

    const renderItems = () => {
        if (items && items.length > 0) {
            return items.map((item, index) => (
                <tr key={item.id}>
                    <td scope="row">{index + 1}</td>
                    <td>
                        <p>{item.title}</p>
                        <div className="separator"></div>
                        <p>{item.summary}</p>
                    </td>
                    <td>
                        <button
                            type="button"
                            className="btn btn-secondary ml-2"
                            onClick={() => onEdit(item.id)}
                            title={general.edit}
                            disabled={layoutState?.loading}
                        >
                            <BsPencilFill />
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary ml-2"
                            title={general.remove}
                            data-coreui-toggle="modal"
                            data-coreui-target="#removeModal"
                            data-coreui-tag={item.id}
                            onClick={() => onRemove(item.id)}
                            disabled={layoutState?.loading}
                        >
                            <BsFillFileExcelFill />
                        </button>
                    </td>
                </tr>
            ));
        }

        if (layoutState?.loading) {
            return (
                <tr>
                    <td colSpan={columnsCount} className="img-loading-wrapper">
                        <img
                            src={`${imgPath}/loading-form.gif`}
                            className="img-loading"
                        />
                    </td>
                </tr>
            );
        }

        return (
            <tr>
                <td colSpan={columnsCount}>{general.noDataFound}</td>
            </tr>
        );
    };

    if (!isCurrent) <></>;

    return (
        <Page page={"Services"}>
            <div className="row mb-2">
                <div className="col-sm-12 mb-4">
                    <button
                        className="btn btn-success px-4"
                        type="button"
                        title={strings.addPost}
                        onClick={onAdd}
                        disabled={layoutState?.loading}
                    >
                        {strings.addPost}
                    </button>
                </div>
            </div>
            <div className="row mb-4">
                <Table
                    items={items}
                    renderHeader={renderHeader}
                    renderItems={renderItems}
                />
            </div>
            {renderRemoveModal()}
        </Page>
    );
};

export default Posts;
