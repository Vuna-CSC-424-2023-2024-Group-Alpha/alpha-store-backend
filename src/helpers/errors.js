
class DomainError extends Error {
    errorName = 'domain_error';
    httpStatusCode = 500;
    data;

    constructor(message = '', data = {}) {
        super(message);
        this.data = data;
    }

    getHttpCode() {
        return this.httpStatusCode;
    }

    getData() {
        return this.data;
    }

    getName() {
        return this.errorName;
    }
}

export class ValidationError extends DomainError {
    constructor(message, data = {}) {
        super(message);
        this.errorName = 'invalid_request';
        this.httpStatusCode = 400;
        this.data = data;
    }
}

export class AuthenticationError extends DomainError {
    constructor(message, data = {}) {
        super(message);
        this.errorName = 'not_authenticated';
        this.httpStatusCode = 401;
        this.data = data;
    }
}

export class ConflictError extends DomainError {
    constructor(message, data = {}) {
        super(message);
        this.errorName = 'conflict';
        this.httpStatusCode = 409;
        this.data = data;
    }
}

export class AuthorizationError extends DomainError {
    constructor(message, data = {}) {
        super(message);
        this.errorName = 'not_authorized';
        this.httpStatusCode = 403;
        this.data = data;
    }
}

export class ResourceNotFoundError extends DomainError {
    constructor(message, data = {}) {
        super(message);
        this.errorName = 'not_found';
        this.httpStatusCode = 404;
        this.data = data;
    }
}

export class BadRequestError extends DomainError {
    constructor(message, data = {}) {
        super(message);
        this.errorName = 'bad_request';
        this.httpStatusCode = 400;
        this.data = data;
    }
}