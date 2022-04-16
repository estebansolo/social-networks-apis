import express from 'express'
import Auth from 'facebook/services/auth'
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
                    error: error.response.data.error.message
                })
            })
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST).send({
            error: RESPONSES.MISSING_CALLBACK_CODE
        })
    }
})


router.get('/verify_token', (req, res) => {
    if(req.query.token) {
        auth.verifyToken(req.query.token)
            .then(response => {
                response = response.data
                if (response.data.error){
                    return Promise.reject(response.data.error.message)
                }
                
                res.json(response)
            })
            .catch(error => {
                if(typeof error !== 'string'){
                    error = error.response.data
                }

                res.status(HTTP_STATUS.UNAUTHORIZED).send({error})
            })
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST).send({
            error: RESPONSES.AUTHENTICATION_TOKEN_REQUIRED
        })
    }
})


export default router