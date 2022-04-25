import express from "express"
import Api from "twitter/service"
import { HttpStatus } from "src/config/constants"
import { authToken } from "src/utilities/middlewares"

const api = new Api()
const router = express.Router()

const errorHandler = res => {
    return error => {
        let errorData = null

        if ("detail" in error.response.data) {
            errorData = error.response.data.detail
        }

        if ("message" in error.response.data) {
            errorData = error.response.data.message
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            error: errorData || 'There was an unexpected error with the API'
        })
    }
}

router.get("/me", authToken, (req, res) => {
    api.getBasicInfo(req.authorization)
        .then(response => res.json(response.data.data))
        .catch(errorHandler(res))
})

router.get("/metrics", authToken, (req, res) => {
    api.getPublicMetrics(req.authorization)
        .then(response => res.json(response))
        .catch(errorHandler(res))
})

router.get("/posts/:id", authToken, (req, res) => {
    const tweetId = req.params.id

    api.getTweetLookup(tweetId, req.authorization)
        .then(response => {
            if (response.data && "errors" in response.data) {
                return Promise.reject(response.data.errors)
            }

            res.json(response)
        })
        .catch(errorHandler(res))
})

export default router
