import qs from "qs"
import axios from "axios"
import { LINKEDIN_URLS } from "src/config/constants"

class Media {
    constructor(token) {
        this.token = token
    }

    upload(data) {
        return Promise.resolve()
            .then(() => {
                return this._preload(data)
            })
            .then(json => {
                return this._uploadAsset(json, data.data)
            })
            .then(json => {
                return this.validateAsset(json.asset)
            })
    }

    _preload(data){
        const dataUpload = {
            "registerUploadRequest": {
                "owner": `urn:li:person:${data.linkedinId}`,
                "recipes": [],
                "serviceRelationships": [
                    {
                        "identifier": "urn:li:userGeneratedContent",
                        "relationshipType": "OWNER"
                    }
                ]
            }
        }

        const headers = {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
        }

        const url = `${LINKEDIN_URLS.API_URL}/assets?action=registerUpload`

        if (data.mimeType.indexOf('image') !== -1){
            dataUpload.registerUploadRequest.supportedUploadMechanism = ["SYNCHRONOUS_UPLOAD"]
            dataUpload.registerUploadRequest.recipes.push("urn:li:digitalmediaRecipe:feedshare-image")
        } else {
            dataUpload.registerUploadRequest.recipes.push("urn:li:digitalmediaRecipe:feedshare-video")
        }

        return this._request(url, 'POST', dataUpload, headers).then(json => ({
            mimeType: data.mimeType,
            asset: json.value.asset,
            uploadUrl: json.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl
        }))
    }

    _uploadAsset(uploadInfo, assetContent) {
        const headers = {}
        if (uploadInfo.mimeType.indexOf('image') !== -1){
            headers["Authorization"] = `Bearer ${this.token}`
            headers["Content-Type"] = uploadInfo.mimeType
        } else {
            headers["Content-Type"] = "application/octet-stream"
        }

        return this._request(uploadInfo.uploadUrl, 'POST', assetContent, headers).then(() => (uploadInfo))
    }

    validateAsset(assetId) {
        const headers = {
            Authorization: `Bearer ${this.token}`
        }
        
        const assetData = assetId.split(':')
        const url = `${LINKEDIN_URLS.API_URL}/assets/${assetData[assetData.length - 1]}`

        return this._request(url, 'GET', null, headers).then(json => ({
            id: json.id,
            status: json.recipes[0].status
        }))
    }

    async _request(url, method, data = {}, headers = {}) {
        const response = await axios({
            url,
            method,
            data,
            headers,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        })
        
        return response.data
    }
}

export default Media
