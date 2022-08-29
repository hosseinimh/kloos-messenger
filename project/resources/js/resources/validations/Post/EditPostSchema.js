import * as yup from "yup";
import {
    validation,
    editPostPage as strings,
} from "../../../constants/strings";

const editPostSchema = yup.object().shape({
    title: yup
        .string(validation.stringMessage.replace(":field", strings.title))
        .min(
            3,
            validation.minMessage
                .replace(":field", strings.title)
                .replace(":min", "3")
        )
        .max(
            50,
            validation.maxMessage
                .replace(":field", strings.title)
                .replace(":max", "50")
        )
        .required(validation.requiredMessage.replace(":field", strings.title)),
    summary: yup
        .string(validation.stringMessage.replace(":field", strings.summary))
        .max(
            200,
            validation.maxMessage
                .replace(":field", strings.summary)
                .replace(":max", "200")
        ),
    body: yup
        .string(validation.stringMessage.replace(":field", strings.body))
        .max(
            2000,
            validation.maxMessage
                .replace(":field", strings.body)
                .replace(":max", "2000")
        ),
});

export default editPostSchema;
