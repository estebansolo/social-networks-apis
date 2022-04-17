import express from 'express'
import Api from 'twitter/service'
import { HTTP_STATUS, RESPONSES } from "config/constants"
import { authToken } from "utilities/middlewares"


const api = new Api();
const router = express.Router()


router.get('/me', authToken, (req, res) => {
    api.getBasicInfo(req.authToken).then(response => {
        res.json(response.data.data)
    }).catch(() => {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            error: RESPONSES.API_ERROR
        })
    })
})


router.get('/metrics', authToken, (req, res) => {
    api.getPublicMetrics(req.authToken).then(response => {
        res.json(response.data.data)
    }).catch(() => {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            error: RESPONSES.API_ERROR
        })
    })
})


router.get('/tweet/:id', authToken, (req, res) => {
    const tweetId = req.params.id
    
    api.getTweetLookup(tweetId, req.authToken).then(response => {
        if ('errors' in response.data){
            return Promise.reject(response.data.errors)
        }

        res.json(response.data.data)
    }).catch((error) => {
        if(typeof error === 'object'){
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
                error: 'message' in error ? error.message : error[0].detail
            })
        }

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            error: RESPONSES.API_ERROR
        })
    })
})


export default router