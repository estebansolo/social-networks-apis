import express from 'express'
import Api from 'twitter/services/api'
import { HTTP_STATUS, RESPONSES } from "src/config/constants"


const api = new Api();
const router = express.Router()


router.get('/me', (req, res) => {
    const token = req.query.token ? req.query.token : null

    if(token){
        api.getBasicInfo(token).then(response => {
            res.json(response.data)
        }).catch(() => {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
                error: RESPONSES.API_ERROR
            })
        })
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST).send({
            error: RESPONSES.AUTHENTICATION_TOKEN_REQUIRED
        })
    }
})


router.get('/metrics', (req, res) => {
    const token = req.query.token ? req.query.token : null

    if(token){
        api.getPublicMetrics(token).then(response => {
            res.json(response.data)
        }).catch(() => {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
                error: RESPONSES.API_ERROR
            })
        })
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST).send({
            error: RESPONSES.AUTHENTICATION_TOKEN_REQUIRED
        })
    }
})


export default router