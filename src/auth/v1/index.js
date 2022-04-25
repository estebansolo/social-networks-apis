import express from "express"
import Auth from "auth/v1/service"
import { HttpStatus, Provider } from "src/config/constants"
import { validateProvider, validateAuthFields } from "src/utilities/middlewares"

const router = express.Router()

const errorHandler = error => {
    let errorData = error.data || error.toString()
    if (typeof errorData == "string") {
        errorData = errorData.replace(/<[^>]*>/g, "")
    }

    return [errorData]
}

router.get("/", validateProvider([Provider.TWITTER]), validateAuthFields, async (req, res) => {
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
})

// TODO: Hardcoded Provider because it's the only API that use OAuth V1

router.get("/callback", validateAuthFields, async (req, res) => {
    const authData = {
        oauthToken: req.query.oauth_token,
        oauthVerifier: req.query.oauth_verifier,
        clientId: req.headers.client_id,
        clientSecret: req.headers.client_secret,
        redirectUri: req.query.redirect_uri
    }

    try {
        if (!authData.oauthToken || !authData.oauthVerifier) {
            throw "Callback values required oauth_token, and oauth_verifier"
        }

        const response = await Auth.getAuthCode("TWITTER", authData)
        res.json(response)
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).send({
            errors: errorHandler(error)
        })
    }
})

router.get("/verify_token", validateProvider([Provider.TWITTER]), validateAuthFields, async (req, res) => {
    const provider = req.query.provider.toUpperCase()

    const authData = {
        clientId: req.headers.client_id,
        clientSecret: req.headers.client_secret,
        redirectUri: req.query.redirect_uri,
        accessToken: req.headers.access_token,
        accessTokenSecret: req.headers.access_token_secret
    }

    try {
        if (!authData.accessToken || !authData.accessTokenSecret) {
            throw "Authentication values required access_token, and access_token_secret"
        }

        const response = await Auth.verifyToken(provider, authData)
        res.json(response)
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).send({
            errors: [
                error.toString()
            ]
        })
    }
})

export default router
