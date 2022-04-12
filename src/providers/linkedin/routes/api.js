import express from 'express'
import Api from 'linkedin/services/api'
import { HTTP_STATUS, RESPONSES } from "src/config/constants";


const api = new Api();
const router = express.Router()


router.get('/me', (req, res) => {
    const token = req.body.token ? req.body.token : null

    if(token){
        api.getLinkedInId(token).then(response => {
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


router.get('/connections', (req, res) => {
    const token = req.body.token ? req.body.token : null
    const linkedinId = req.body.linkedin_id ? req.body.linkedin_id : null

    if(token){
        api.getConnections(token, linkedinId).then(response => {
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


router.post('/share', (req, res) => {
    app.post('/publish', async (req, res) => {
        const { title, text, url, thumb, id } = req.body;
        const errors = [];
    
        if(validator.isEmpty(title)) {
            errors.push({ param: 'title', msg: 'Invalid value.'});
        }
        if(validator.isEmpty(text)) {
            errors.push({ param: 'text', msg: 'Invalid value.'});
        }
        if(!validator.isURL(url)) {
            errors.push({ param: 'url', msg: 'Invalid value.'});
        }
        if(!validator.isURL(thumb)) {
            errors.push({ param: 'thumb', msg: 'Invalid value.'});
        }
    
        if(errors.length > 0) {
            res.json({ errors });
        } else {
            const content = {
                title: title,
                text: text,
                shareUrl: url,
                shareThumbnailUrl: thumb
            };
    
            try {
                const response = await API.publishContent(req, id, content);
                res.json({ success: 'Post published successfully.' });
            } catch(err) {
                res.json({ error: 'Unable to publish your post.' });
            }
        }
    });
})


export default router