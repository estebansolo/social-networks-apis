import express from 'express'
import Api from 'linkedin/service'
import { HTTP_STATUS, RESPONSES } from "config/constants"
import { authToken } from "utilities/middlewares"


const api = new Api();
const router = express.Router()


router.get('/me', authToken, (req, res) => {
    api.getBasicInfo(req.authToken).then(response => {
        res.json(response.data)
    }).catch(() => {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            error: RESPONSES.API_ERROR
        })
    })
})


router.get('/connections', authToken, (req, res) => {
    const linkedinId = req.query.linkedin_id ? req.query.linkedin_id : null

    api.getConnections(req.authToken, linkedinId).then(response => {
        res.json(response.data)
    }).catch(() => {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            error: RESPONSES.API_ERROR
        })
    })
})


router.get('/posts/:id', authToken, (req, res) => {
    const postId = req.params.id
    
    api.getPostLookup(postId, req.authToken).then(response => {
        res.json(response.data)
    }).catch((error) => {
        if(typeof error === 'object'){
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
                error: 'message' in error ? error.message : error
            })
        }

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            error: RESPONSES.API_ERROR
        })
    })
})


export default router