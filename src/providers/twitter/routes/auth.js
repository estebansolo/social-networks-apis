import express from 'express'
import Auth from 'twitter/services/auth'
import { HTTP_STATUS, RESPONSES } from "src/config/constants";


const auth = new Auth();
const router = express.Router()


router.get('/', (req, res) => {
    res.json(auth.getUrl())
})


router.get('/callback', (req, res) => {
    if(req.query.code) {
        auth.getAuthCode(req.query.code)
            .then(response => res.json(response.data))
            .catch(error => {
                res.status(HTTP_STATUS.UNAUTHORIZED).send({
                    error: error.response.data.error_description
                })
            })
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST).send({
            error: RESPONSES.MISSING_CALLBACK_CODE
        })
    }
})


router.put('/refresh_token', (req, res) => {
    const refreshToken = req.body.refresh_token ? req.body.refresh_token : null 
    
    if(refreshToken) {
        auth.getAuthCode(refreshToken, true)
            .then(response => res.json(response.data))
            .catch(error => {
                res.status(HTTP_STATUS.UNAUTHORIZED).send({
                    error: error.response.data.error_description
                })
            })
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST).send({
            error: RESPONSES.MISSING_FIELDS_OR_WRONG_INPUTS
        })
    }
})


export default router