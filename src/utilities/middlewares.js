import { HTTP_STATUS, RESPONSES } from "config/constants"

export const validateProvider = providers => {
    return (req, res, next) => {
        const provider = req.params.provider.toUpperCase()

        if (providers.indexOf(provider) === -1) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send({
                error: RESPONSES.INVALID_PROVIDER
            })
        }

        next()
    }
}

export const validateAuthField = (req, res, next) => {
    const urlPath = req.path.split("/")

    switch (urlPath[urlPath.length - 1]) {
        case "callback":
            if (!req.query.code) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send({
                    error: RESPONSES.MISSING_CALLBACK_CODE
                })
            }

            break

        case "refresh_token":
            if (!req.body.refresh_token) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send({
                    error: RESPONSES.MISSING_FIELDS_OR_WRONG_INPUTS
                })
            }

            break
    }

    next()
}

export const authToken = (req, res, next) => {
    // TODO: Change using header
    if (!req.query.token) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
            error: RESPONSES.AUTHENTICATION_TOKEN_REQUIRED
        })
    }

    req.authToken = req.query.token
    next()
}
