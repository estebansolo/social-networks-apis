import axios from "axios"
import express from "express"
import Api from "linkedin/service"
import { HttpStatus } from "src/config/constants"
import { authToken } from "src/utilities/middlewares"

const router = express.Router()

const errorHandler = res => {
    return error => {
        let errorData = error.toString()
        
        if('response' in error && error.response != undefined && typeof error.response.data === "object"){
            errorData = error.response.data
            errorData = "message" in errorData ? errorData.message : errorData
        }

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errors: [errorData]})
    }
}

const getFileStream = async req => {
    const fileExist = req.files && 'file' in req.files
    if(fileExist){
        return req.files.file
    }
    
    if(req.body.file !== undefined && req.body.file !== null){
        const response = await axios.get(req.body.file, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data, "utf-8")

        return {
            data: buffer,
            size: buffer.toString().length,
            mimetype: response.headers['content-type']
        }
    }

    return null
}

router.get("/me", authToken, (req, res) => {
    Api.getBasicInfo(req.authorization)
        .then(response => res.json(response.data))
        .catch(errorHandler(res))
})

router.get("/connections", authToken, (req, res) => {
    const linkedinId = req.query.linkedin_id

    Api.getConnections(req.authorization, linkedinId)
        .then(response => res.json(response))
        .catch(errorHandler(res))
})

router.get("/posts/:id", authToken, (req, res) => {
    const postId = req.params.id

    Api.getPostLookup(postId, req.authorization)
        .then(response => res.json(response))
        .catch(errorHandler(res))
})

router.post("/posts", authToken, (req, res) => {
    const data = {
        message: req.body.message || '',
        mediaIds: req.body.media_ids || [],
        mediaCategory: req.body.media_category || 'NONE',
        linkedinId: req.query.linkedin_id
    }

    if (data.message === '' && data.mediaIds.length == 0){
        res.status(HttpStatus.BAD_REQUEST).send({errors: ["We require message or media ids to publish"]})
    }

    Api.createPost(data, req.authorization)
        .then(response => res.json(response))
        .catch(errorHandler(res))
})

router.get("/upload", authToken, (req, res) => {
    Api.validateMedia(req.query.asset_id, req.authorization)
        .then(response => res.json(response))
        .catch(errorHandler(res))
})

router.post("/upload", authToken, async (req, res) => {
    const fileStream = await getFileStream(req)
    if(!fileStream || fileStream == null){
        return res.status(HttpStatus.BAD_REQUEST).send({errors: ['No file uploaded']})
    }
    
    const data = {
        data: fileStream.data,
        size: fileStream.size,
        mimeType: fileStream.mimetype,
        linkedinId: req.query.linkedin_id
    }
    
    Api.uploadMedia(data, req.authorization)
        .then(response => res.json(response))
        .catch(errorHandler(res))
})

export default router
