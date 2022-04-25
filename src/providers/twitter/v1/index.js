import express from "express"
import Api from "twitter/v1/service"
import { HttpStatus } from "src/config/constants"
import { validateAuthFields } from "src/utilities/middlewares"

const router = express.Router()

const errorHandler = error => {
    if (typeof error == "string") {
        return [
            error.replace(/<[^>]*>/g, "")
        ]
    }

    try {
        let errorData = JSON.parse(error.data)
        return errorData.errors.map((error) => error.message)
    } catch (error) {
        return [
            error.toString()
        ]
    }
}

router.get("/me", validateAuthFields, async (req, res) => {
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

        const response = await Api.getBasicInfo(authData)
        res.json(response)
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).send({
            errors: errorHandler(error)
        })
    }
})

router.get("/metrics", validateAuthFields, async (req, res) => {
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

        const response = await Api.getPublicMetrics(authData)
        res.json(response)
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).send({
            errors: errorHandler(error)
        })
    }
})

router.get("/posts/:id", validateAuthFields, async (req, res) => {
    const tweetId = req.params.id

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

        const response = await Api.getTweetLookup(tweetId, authData)
        res.json(response)
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).send({
            errors: errorHandler(error)
        })
    }
})

export default router
