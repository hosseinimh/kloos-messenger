import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { InsertPage } from "../_layout";
import { Post as Entity, Service } from "../../../http/entities";
import { editPostPage as strings, general } from "../../../constants/strings";
import { editPostSchema as schema } from "../../validations";
import {
    MESSAGE_TYPES,
    MESSAGE_CODES,
    basePath,
    UPLOADED_FILE,
} from "../../../constants";
import {
    setLoadingAction,
    setTitleAction,
} from "../../../state/layout/layoutActions";
import {
    clearMessageAction,
    setMessageAction,
} from "../../../state/message/messageActions";

const EditPost = () => {
    const dispatch = useDispatch();
    const layoutState = useSelector((state) => state.layoutReducer);
    const messageState = useSelector((state) => state.messageReducer);
    const navigate = useNavigate();
    let entity = new Entity();
    let { postId } = useParams();
    postId = parseInt(postId);
    const [service, setService] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [image, setImage] = useState(null);
    const [isCurrent, setIsCurrent] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const fillForm = async () => {
        dispatch(setLoadingAction(true));

        let result = await entity.get(postId);

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

        if (!(await fetchService(result.item.serviceId))) {
            return;
        }

        setValue("title", result.item.title);
        setValue("summary", result.item.summary);
        setValue("body", result.item.body);
        dispatch(setTitleAction(`${strings._title} [ ${result.item.title} ]`));

        dispatch(setLoadingAction(false));
    };

    const fetchService = async (id) => {
        const srv = new Service();
        let result = await srv.get(id);

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

        return result;
    };

    const onSubmit = async (data) => {
        dispatch(setLoadingAction(true));
        dispatch(clearMessageAction());

        let result = await entity.update(
            postId,
            data.title,
            data.summary,
            data.body,
            thumbnail,
            image
        );

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
            thumbnail &&
            (!result?.uploadedThumbnail ||
                result?.uploadedThumbnail !== UPLOADED_FILE.OK)
        ) {
            dispatch(setLoadingAction(false));
            dispatch(
                setMessageAction(
                    result?.uploadedThumbnailText,
                    MESSAGE_TYPES.ERROR,
                    result?.uploadedThumbnail,
                    true,
                    "thumbnail"
                )
            );

            return;
        }

        if (
            image &&
            (!result?.uploadedImage ||
                result?.uploadedImage !== UPLOADED_FILE.OK)
        ) {
            dispatch(setLoadingAction(false));
            dispatch(
                setMessageAction(
                    result?.uploadedImageText,
                    MESSAGE_TYPES.ERROR,
                    result?.uploadedImage,
                    true,
                    "image"
                )
            );

            return;
        }

        dispatch(
            setMessageAction(
                strings.submitted,
                MESSAGE_TYPES.SUCCESS,
                MESSAGE_CODES.OK,
                false
            )
        );

        navigate(`${basePath}/posts/${service.id}`);
    };

    const onCancel = () => {
        navigate(`${basePath}/posts/${service.id}`);
    };

    useEffect(() => {
        dispatch(setTitleAction(strings._title));

        if (isNaN(postId) || postId <= 0) {
            dispatch(
                setMessageAction(
                    general.itemNotFound,
                    MESSAGE_TYPES.ERROR,
                    MESSAGE_CODES.ITEM_NOT_FOUND,
                    false
                )
            );
            navigate(basePath);

            return;
        }

        fillForm();

        return () => {
            setIsCurrent(false);
        };
    }, []);

    const onChangeFile = (e) => {
        const file = e?.target?.files[0];

        if (file) {
            if (e?.target?.id === "thumbnail") {
                setThumbnail(file);
            } else if (e?.target?.id === "image") {
                setImage(file);
            }
        }
    };

    const renderInputRow = (field, type = "text", placeholder = null) => {
        placeholder = placeholder
            ? placeholder
            : strings[`${field}Placeholder`];

        return (
            <div className="col-md-6 col-sm-12 pb-4">
                <label className="form-label" htmlFor={field}>
                    {strings[field]}
                </label>
                <input
                    {...register(`${field}`)}
                    className={
                        messageState?.messageField === field
                            ? "form-control is-invalid"
                            : "form-control"
                    }
                    id={field}
                    placeholder={placeholder}
                    disabled={layoutState?.loading}
                    type={type}
                />
                {messageState?.messageField === field && (
                    <div className="invalid-feedback">
                        {messageState?.message}
                    </div>
                )}
            </div>
        );
    };

    const renderFileRow = (field) => (
        <div className="col-md-6 col-sm-12 pb-4">
            <label className="form-label" htmlFor={field}>
                {strings[field]}
            </label>
            <input
                {...register(`${field}`)}
                className={
                    messageState?.messageField === field
                        ? "form-control is-invalid"
                        : "form-control"
                }
                id={field}
                placeholder={strings[`${field}Placeholder`]}
                disabled={layoutState?.loading}
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={(e) => onChangeFile(e)}
            />
            {messageState?.messageField === field && (
                <div className="invalid-feedback">{messageState?.message}</div>
            )}
        </div>
    );

    const renderTextareaRow = (field) => {
        return (
            <div className="col-md-6 col-sm-12 pb-4">
                <label className="form-label" htmlFor={field}>
                    {strings[field]}
                </label>
                <textarea
                    {...register(`${field}`)}
                    className={
                        messageState?.messageField === field
                            ? "form-control is-invalid"
                            : "form-control"
                    }
                    style={{ height: "6rem" }}
                    id={field}
                    placeholder={strings[`${field}Placeholder`]}
                    readOnly={layoutState?.loading}
                ></textarea>
                {messageState?.messageField === field && (
                    <div className="invalid-feedback">
                        {messageState?.message}
                    </div>
                )}
            </div>
        );
    };

    const renderForm = () => (
        <div className="card mb-4">
            <div className="card-body">
                <div className="row">
                    {renderInputRow("title")}
                    <div className="col-md-6 col-sm-12 pb-4"></div>
                    {renderTextareaRow("summary")}
                    {renderTextareaRow("body")}
                    {renderFileRow("thumbnail")}
                    {renderFileRow("image")}
                </div>
            </div>
            <div className="card-footer">
                <div className="row">
                    <div className="col-sm-12">
                        <button
                            className="btn btn-success px-4 ml-2"
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={layoutState?.loading}
                        >
                            {general.submit}
                        </button>
                        <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={onCancel}
                            disabled={layoutState?.loading}
                        >
                            {general.cancel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!isCurrent) <></>;

    return (
        <InsertPage page={"Services"} errors={errors}>
            <div className="row">
                <div className="col-12">{renderForm()}</div>
            </div>
        </InsertPage>
    );
};

export default EditPost;
