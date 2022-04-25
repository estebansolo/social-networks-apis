import express from "express"
import Api from "linkedin/service"
import { HttpStatus } from "src/config/constants"
import { authToken } from "src/utilities/middlewares"

const router = express.Router()

const errorHandler = res => {
    return error => {
        if (typeof error.response.data === "object") {
            const errorData = error.response.data
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                errors: [
                    "message" in errorData ? errorData.message : errorData
                ]
            })
        }

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            errors: [
                'There was an unexpected error with the API'
            ]
        })
    }
}

router.get("/me", authToken, (req, res) => {
    Api.getBasicInfo(req.authorization)
        .then(response => res.json(response.data))
        .catch(errorHandler(res))
})

router.get("/connections", authToken, (req, res) => {
    const linkedinId = req.query.linkedin_id

    Api.getConnections(req.authorization, linkedinId)
        .then(response => res.json(response))
        .catch(errorHandler(res))
})

router.get("/posts/:id", authToken, (req, res) => {
    const postId = req.params.id

    Api.getPostLookup(postId, req.authorization)
        .then(response => res.json(response))
        .catch(errorHandler(res))
})

router.post("/posts", authToken, (req, res) => {
    const linkedinId = req.query.linkedin_id

    const body = {
        message: "Hello World", // String. Max 3000
        mentions: [
            {
                "entity": "urn:li:organization:2414183",
                "length": 9,
                "start": 6
            }
        ],
        entities: [
            {
                "entity": ""
            }
        ] //https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/vector-asset-api?tabs=http
    }

    Api.createPost(req.authorization, linkedinId)
        .then(response => res.json(response.data))
        .catch(errorHandler(res))
})



export default router
