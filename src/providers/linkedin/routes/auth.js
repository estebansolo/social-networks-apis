import express from 'express'
import Auth from 'linkedin/services/auth'
import { HTTP_STATUS, RESPONSES } from "src/config/constants";


const auth = new Auth();
const router = express.Router()


router.get('/', (req, res) => {
    auth.getUrl().then(response => {
        res.json(response)
    }).catch(() => {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            error: RESPONSES.MISSING_FIELDS_OR_WRONG_INPUTS
        })
    })
})

router.get('/callback', (req, res) => {
    if(req.query.code) {
        auth.getAuthCode(req.query.code).then(response => {
            res.json(response.data)
        }).catch((error) => {
            res.status(HTTP_STATUS.UNAUTHORIZED).send(error.response.data)
        })   
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST).send({
            error: "Code parameter is required to perform the authentication operation"
        })
    }
})


router.put('/refresh_token', (req, res) => {
    const refresh_token = req.body.refresh_token ? req.body.refresh_token : null 
    if(refresh_token) {
        auth.getAuthCode(refresh_token, true).then(response => {
            res.json(response.data)
        }).catch((error) => {
            res.status(HTTP_STATUS.UNAUTHORIZED).send(error.response.data)
        })   
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST).send({
            error: RESPONSES.MISSING_FIELDS_OR_WRONG_INPUTS
        })
    }
})

export default router