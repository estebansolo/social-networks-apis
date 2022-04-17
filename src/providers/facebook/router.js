import express from 'express'
import Api from 'facebook/service'
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


router.get('/friends', authToken, (req, res) => {
    const facebookId = req.query.facebook_id ? req.query.facebook_id : null

    api.getFriends(req.authToken, facebookId).then(response => {
        res.json(response.data)
    }).catch(() => {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            error: RESPONSES.API_ERROR
        })
    })
})


export default router