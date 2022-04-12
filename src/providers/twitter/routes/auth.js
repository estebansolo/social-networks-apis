import express from 'express'
import Auth from 'twitter/services/auth'
import { HTTP_STATUS, RESPONSES } from "src/config/constants";


const auth = new Auth();
const router = express.Router()


router.get('/', (req, res) => {
    auth.getUrl()
        .then(response => res.json(response))
        .catch(error => res.status(HTTP_STATUS.UNAUTHORIZED).send({
            error: error
        }))
})


router.get('/callback', (req, res) => {
    if(req.query.oauth_token && req.query.oauth_verifier) {
        auth.getAuthCode(req.query.oauth_token, req.query.oauth_verifier)
            .then(response => res.json(response))
            .catch(error => res.status(HTTP_STATUS.UNAUTHORIZED).send({
                error: error
            }))
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST).send({
            error: RESPONSES.MISSING_CALLBACK_CODE
        })
    }
})

router.get('/verify_token', (req, res) => {
    if(req.query.access_token && req.query.access_token_secret) {
        auth.verifyToken(req.query.access_token, req.query.access_token_secret)
            .then(response => res.json(response))
            .catch(error => res.status(HTTP_STATUS.UNAUTHORIZED).send({
                error: error
            }))   
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST).send({
            error: RESPONSES.AUTHENTICATION_TOKEN_REQUIRED
        })
    }
})


export default router