import express from "express"
import Api from "facebook/service"
import { HttpStatus } from "src/config/constants"
import { authToken } from "src/utilities/middlewares"

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

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            error: errorData || 'There was an unexpected error with the API'
        })
    }
}

router.get("/me", authToken, (req, res) => {
    Api.getBasicInfo(req.authorization)
        .then(response => res.json(response.data))
        .catch(errorHandler(res))
})

router.get("/friends", authToken, (req, res) => {
    const facebookId = req.query.facebook_id

    Api.getFriends(req.authorization, facebookId)
        .then(response => res.json(response))
        .catch(errorHandler(res))
})

router.get("/posts", authToken, (req, res) => {
    const facebookId = req.query.facebook_id
    const followUrl = req.query.follow_url

    Api.getPosts(facebookId, req.authorization, followUrl)
        .then(response => res.json(response.data))
        .catch(errorHandler(res))
})

router.get("/posts/:id", authToken, (req, res) => {
    const postId = req.params.id
    const facebookId = req.query.facebook_id

    Api.getPostLookup(postId, facebookId, req.authorization)
        .then(response => res.json(response))
        .catch(errorHandler(res))
})

export default router
