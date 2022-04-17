import express from 'express'
import Auth from 'auth/service'
import { HTTP_STATUS, RESPONSES, VALID_PROVIDERS } from "config/constants";
import { validateProvider, validateAuthField } from "utilities/middlewares"


const auth = new Auth();
const router = express.Router()


router.get('/:provider', validateProvider(VALID_PROVIDERS), (req, res) => {
    const provider = req.params.provider.toUpperCase()
    res.json(auth.setProvider(provider).getUrl())
})


router.get('/:provider/callback', validateProvider(VALID_PROVIDERS), validateAuthField, (req, res) => {
    const provider = req.params.provider.toUpperCase()
    
    auth.setProvider(provider).getAuthCode(req.query.code)
        .then(response => res.json(response.data))
        .catch(error => {
            const data = error.response.data
            const message = data.error_description ? data.error_description : data.error.message

            res.status(HTTP_STATUS.UNAUTHORIZED).send({
                error: message
            })
        })
})


router.put('/:provider/refresh_token', validateProvider(['LINKEDIN', 'TWITTER']), validateAuthField, (req, res) => {
    const provider = req.params.provider.toUpperCase() 
    
    auth.setProvider(provider).getAuthCode(req.body.refresh_token, true)
        .then(response => res.json(response.data))
        .catch(error => {
            res.status(HTTP_STATUS.UNAUTHORIZED).send({
                error: error.response.data.error_description
            })
        })
})


router.get('/:provider/verify_token', validateProvider(['FACEBOOK']), validateAuthField, (req, res) => {
    const provider = req.params.provider.toUpperCase()

    auth.setProvider(provider).verifyToken(req.query.token)
        .then(response => {
            response = response.data

            if (response.data.error){
                return Promise.reject(response.data.error.message)
            }
            
            res.json(response.data)
        })
        .catch(error => {
            if(typeof error !== 'string'){
                error = error.response.data
            }

            res.status(HTTP_STATUS.UNAUTHORIZED).send({error})
        })
})


export default router