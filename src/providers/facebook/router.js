import express from "express"
import Api from "facebook/service"
import { HTTP_STATUS, RESPONSES } from "config/constants"
import { authToken } from "utilities/middlewares"

const api = new Api()
const router = express.Router()

const errorHandler = res => {
    return error => {
        let errorData = null

        if (
            typeof error === "object" &&
            "response" in error &&
            error.response.data &&
            "error" in error.response.data
        ) {
            errorData = error.response.data.error.message
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            error: errorData || RESPONSES.API_ERROR
        })
    }
}

router.get("/me", authToken, (req, res) => {
    api.getBasicInfo(req.authToken)
        .then(response => res.json(response.data))
        .catch(errorHandler(res))
})

router.get("/friends", authToken, (req, res) => {
    const facebookId = req.query.facebook_id

    api.getFriends(req.authToken, facebookId)
        .then(response => res.json(response))
        .catch(errorHandler(res))
})

router.get("/posts", authToken, (req, res) => {
    const facebookId = req.query.facebook_id
    const followUrl = req.query.follow_url

    api.getPosts(facebookId, req.authToken, followUrl)
        .then(response => res.json(response.data))
        .catch(errorHandler(res))
})

router.get("/posts/:id", authToken, (req, res) => {
    const postId = req.params.id
    const facebookId = req.query.facebook_id

    api.getPostLookup(postId, facebookId, req.authToken)
        .then(response => res.json(response))
        .catch(errorHandler(res))
})

export default router
