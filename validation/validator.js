import { BadRequestError } from '../helpers/errors.js';

const getErrMessage = (item) => {
    let message;
    switch (item.type) {
        case `${item.type.split('.')[0]}.only`:
            message = `${item?.context?.value} is not a valid option`;
            break;
        case `${item.type.split('.')[0]}.required`:
            message = `${item.path.join('.')} is required`;
            break;
        case `object.min`:
            message = `This request body should not be empty`;
            break;
        case `string.min`:
            message = `${item.path.join('.')} should have at least ${item?.context?.limit} characters!`;
            break;
        case `string.max`:
            message = `${item.path.join('.')} should have at most ${item?.context?.limit} characters!`;
            break;
        case `string.alphanum`:
            message = `${item.path.join('.')} should contain only alphanumeric characters`;
            break;
        case `string.base`:
            message = `${item.path.join('.')} should be a string`;
            break;
        case `string.length`:
            message = `${item.path.join('.')} should only be ${item?.context?.limit} characters, no less, no more`;
            break;
        default:
            break;
    }
    return message;
};

const buildErrorObject = (errors) => {
    const customErrors = {};
    errors.forEach((item) => {
        if (!Object.prototype.hasOwnProperty.call(customErrors, item.path.join('.'))) {
            getErrMessage(item);

            customErrors[item.path.join('.')] = {
                message: item.message.replace(/['"]+/g, '')
            };
        }
    });

    return customErrors;
};

export const validator = (request, schema) => {
    const validation = schema.validate(request, { abortEarly: false });
    const { value, error } = validation;

    if (error) {
        throw new BadRequestError('Invalid request data', buildErrorObject(error.details));
    }

    return value;
};