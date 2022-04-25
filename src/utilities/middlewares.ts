import { HttpStatus } from "../config/constants"

export const validateProvider = (providers: string[]) => {
    return (req: any, res: any, next: any) => {
        const errors = []
        const provider: string = req.query.provider
            ? req.query.provider.toUpperCase()
            : ""

        if (!provider) {
            errors.push("Header provider is required")
        }

        if (provider != "" && providers.indexOf(provider) === -1) {
            errors.push("Header provider is not valid")
        }

        if (errors.length > 0) {
            return res.status(HttpStatus.BAD_REQUEST).send({ errors })
        }

        next()
    }
}

export const validateAuthFields = (req: any, res: any, next: any) => {
    if (
        !req.headers.client_id ||
        !req.headers.client_secret ||
        !req.query.redirect_uri
    ) {
        return res.status(HttpStatus.BAD_REQUEST).send({
            errors: [
                "Authentication values required client_id, client_secret, and redirect_uri"
            ]
        })
    }

    next()
}

export const validateTokenOrCode = (req: any, res: any, next: any) => {
    const urlPath = req.path.split("/")

    switch (urlPath[urlPath.length - 1]) {
        case "callback":
            if (!req.query.code) {
                return res.status(HttpStatus.BAD_REQUEST).send({
                    errors: [
                        "code parameter is required to perform the authentication operation"
                    ]
                })
            }

            break

        case "refresh_token":
            if (!req.body.refresh_token) {
                return res.status(HttpStatus.BAD_REQUEST).send({
                    errors: ["refresh_token parameter is required"]
                })
            }

            break
    }

    next()
}

export const authToken = (req: any, res: any, next: any) => {
    if (!req.headers.authorization) {
        return res.status(HttpStatus.BAD_REQUEST).send({
            errors: ["Authorization token is required to use the API"]
        })
    }

    req.authorization = req.headers.authorization
    next()
}
