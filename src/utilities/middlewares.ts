import { HTTP_STATUS, RESPONSES } from "../config/constants"

export const validateProvider = (providers: string[]) => {
    return (req: any, res: any, next: any) => {
        const provider = req.params.provider.toUpperCase()

        if (providers.indexOf(provider) === -1) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send({
                error: RESPONSES.INVALID_PROVIDER
            })
        }

        next()
    }
}

export const validateAuthField = (req: any, res: any, next: any) => {
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

export const authToken = (req: any, res: any, next: any) => {
    // TODO: Change using header
    if (!req.query.token) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
            error: RESPONSES.AUTHENTICATION_TOKEN_REQUIRED
        })
    }

    req.authToken = req.query.token
    next()
}
