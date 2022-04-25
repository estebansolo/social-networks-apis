import express from "express"
import Auth from "auth/v2/service"
import { HttpStatus, Provider } from "src/config/constants"
import {
    validateProvider,
    validateTokenOrCode,
    validateAuthFields,
    authToken
} from "src/utilities/middlewares"

const router = express.Router()

const errorHandler = error => {
    let errorData = error

    if (typeof errorData == "string") {
        errorData = errorData.replace(/<[^>]*>/g, "")
    } else {
        let errorData = "data" in error ? error.data : error.toString()

        if (typeof errorData == "object") {
            errorData = errorData.error_description || errorData.error.message
        }
    }

    return [
        errorData
    ]
}

router.get(
    "/",
    validateProvider(Object.keys(Provider)),
    validateAuthFields,
    async (req, res) => {
        const provider = req.query.provider.toUpperCase()

        const authData = {
            clientId: req.headers.client_id,
            clientSecret: req.headers.client_secret,
            redirectUri: req.query.redirect_uri
        }

        try {
            const response = await Auth.getUrl(provider, authData)
            res.json(response)
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send({
                errors: errorHandler(error)
            })
        }
    }
)

router.get(
    "/callback",
    validateProvider(Object.keys(Provider)),
    validateTokenOrCode,
    validateAuthFields,
    async (req, res) => {
        const provider = req.query.provider.toUpperCase()

        const authData = {
            code: req.query.code,
            clientId: req.headers.client_id,
            clientSecret: req.headers.client_secret,
            redirectUri: req.query.redirect_uri
        }

        try {
            const response = await Auth.getAuthCode(provider, authData)
            res.json(response.data)
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send({
                errors: errorHandler(error.response)
            })
        }
    }
)

router.put(
    "/refresh_token",
    validateProvider([Provider.LINKEDIN, Provider.TWITTER]),
    validateTokenOrCode,
    validateAuthFields,
    async (req, res) => {
        const provider = req.query.provider.toUpperCase()

        const authData = {
            token: req.body.refresh_token,
            clientId: req.headers.client_id,
            clientSecret: req.headers.client_secret,
            redirectUri: req.query.redirect_uri
        }

        try {
            const response = await Auth.getAuthCode(provider, authData)
            res.json(response.data)
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send({
                errors: errorHandler(error.response)
            })
        }
    }
)

router.get(
    "/verify_token",
    validateProvider([Provider.FACEBOOK]),
    authToken,
    validateAuthFields,
    async (req, res) => {
        const provider = req.query.provider.toUpperCase()

        const authData = {
            token: req.authorization,
            clientId: req.headers.client_id,
            clientSecret: req.headers.client_secret,
            redirectUri: req.query.redirect_uri
        }

        try {
            const response = await Auth.verifyToken(provider, authData)
            
            if (response.data.data.error) {
                throw response.data.data.error.message
            }

            res.json(response.data.data)
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send({
                errors: errorHandler((typeof error === 'string') ? error : error.response)
            })
        }
    }
)

export default router
