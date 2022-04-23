import express from "express"
import Api from "linkedin/service"
import { HTTP_STATUS, RESPONSES } from "config/constants"
import { authToken } from "utilities/middlewares"

const api = new Api()
const router = express.Router()

const errorHandler = res => {
    return error => {
        if (typeof error.response.data === "object") {
            const errorData = error.response.data
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
                error: "message" in errorData ? errorData.message : errorData
            })
        }

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            error: RESPONSES.API_ERROR
        })
    }
}

router.get("/me", authToken, (req, res) => {
    api.getBasicInfo(req.authToken)
        .then(response => res.json(response.data))
        .catch(errorHandler(res))
})

router.get("/connections", authToken, (req, res) => {
    const linkedinId = req.query.linkedin_id

    api.getConnections(req.authToken, linkedinId)
        .then(response => res.json(response))
        .catch(errorHandler(res))
})

router.get("/posts/:id", authToken, (req, res) => {
    const postId = req.params.id

    api.getPostLookup(postId, req.authToken)
        .then(response => res.json(response))
        .catch(errorHandler(res))
})



export default router
