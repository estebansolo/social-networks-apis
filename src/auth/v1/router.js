import express from "express"
import Auth from "auth/v1/service"
import { HTTP_STATUS, RESPONSES, VALID_PROVIDERS } from "src/config/constants"
import { validateProvider, validateAuthField, authToken } from "src/utilities/middlewares"

const auth = new Auth()
const router = express.Router()


router.get('/verify_token', (req, res) => {
    if(req.query.access_token && req.query.access_token_secret) {
        auth.verifyToken(req.query.access_token, req.query.access_token_secret)
            .then(response => res.json(response))
            .catch(error => res.status(HTTP_STATUS.UNAUTHORIZED).send({
                error: error
            }))   
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST).send({
            error: RESPONSES.AUTHENTICATION_TOKEN_REQUIRED
        })
    }
})






router.get("/:provider", validateProvider(VALID_PROVIDERS), (req, res) => {
    const provider = req.params.provider.toUpperCase()
    
    auth.getUrl()
    .then(response => res.json(response))
    .catch(error => res.status(HTTP_STATUS.UNAUTHORIZED).send({
        error: error
    }))
})

router.get(
    "/:provider/callback",
    validateProvider(VALID_PROVIDERS),
    validateAuthField,
    (req, res) => {
        const provider = req.params.provider.toUpperCase()

        if(req.query.oauth_token && req.query.oauth_verifier) {
            auth.getAuthCode(req.query.oauth_token, req.query.oauth_verifier)
                .then(response => res.json(response))
                .catch(error => res.status(HTTP_STATUS.UNAUTHORIZED).send({
                    error: error
                }))
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({
                error: RESPONSES.MISSING_CALLBACK_CODE
            })
        }
    }
)

router.put(
    "/:provider/refresh_token",
    validateProvider(["LINKEDIN", "TWITTER"]),
    validateAuthField,
    (req, res) => {
        const provider = req.params.provider.toUpperCase()

        auth.setProvider(provider)
            .getAuthCode(req.body.refresh_token, true)
            .then(response => res.json(response.data))
            .catch(error => {
                res.status(HTTP_STATUS.UNAUTHORIZED).send({
                    error: error.response.data.error_description
                })
            })
    }
)

router.get(
    "/:provider/verify_token",
    validateProvider(["FACEBOOK"]),
    authToken,
    (req, res) => {
        const provider = req.params.provider.toUpperCase()

        auth.setProvider(provider)
            .verifyToken(req.authToken)
            .then(response => {
                response = response.data

                if (response.data.error) {
                    return Promise.reject(response.data.error.message)
                }

                res.json(response.data)
            })
            .catch(error => {
                if (typeof error !== "string") {
                    error = error.response.data
                }

                res.status(HTTP_STATUS.UNAUTHORIZED).send({ error })
            })
    }
)

export default router
