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


router.post('/share', authToken, (req, res) => {
    // SHARE_URL: 'https://api.linkedin.com/v2/shares'
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