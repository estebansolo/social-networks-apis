import express from "express"
import Api from "twitter/service"
import { HTTP_STATUS, RESPONSES } from "src/config/constants"
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

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            error: errorData || RESPONSES.API_ERROR
        })
    }
}

router.get("/me", authToken, (req, res) => {
    api.getBasicInfo(req.authToken)
        .then(response => res.json(response.data.data))
        .catch(errorHandler(res))
})

router.get("/metrics", authToken, (req, res) => {
    api.getPublicMetrics(req.authToken)
        .then(response => res.json(response))
        .catch(errorHandler(res))
})

router.get("/posts/:id", authToken, (req, res) => {
    const tweetId = req.params.id

    api.getTweetLookup(tweetId, req.authToken)
        .then(response => {
            if (response.data && "errors" in response.data) {
                return Promise.reject(response.data.errors)
            }

            res.json(response)
        })
        .catch(errorHandler(res))
})

export default router
