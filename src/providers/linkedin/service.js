import axios from "axios"
import Media from "linkedin/media"
import { LINKEDIN_URLS, Provider } from "src/config/constants"
import { parseFriends, parsePostMetrics } from "utilities/parsers"

class Api {
    static getBasicInfo(token) {
        const url = `${LINKEDIN_URLS.API_URL}/me`

        return axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    static async getConnections(token, linkedinId) {
        if (!linkedinId) {
            let linkedinData = await this.getBasicInfo(token)
            linkedinId = linkedinData.data.id
        }

        const url = `${LINKEDIN_URLS.API_URL}/connections/urn:li:person:${linkedinId}`

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return parseFriends(response.data, Provider.LINKEDIN)
    }

    static async getPostLookup(postId, token) {
        const url = `${LINKEDIN_URLS.API_URL}/socialMetadata/${postId}`

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return parsePostMetrics(response.data, Provider.LINKEDIN)
    }

    static async createPost(data, token) {
        if (!data.linkedinId) {
            let linkedinData = await this.getBasicInfo(token)
            data.linkedinId = linkedinData.data.id
        }
    
        if (data.mediaCategory === 'VIDEO') {
            return this._ugcPostForVideos(data, token)
        }

        return this._shares(data, token)
    }

    static async _shares(data, token){
        const url = `${LINKEDIN_URLS.API_URL}/shares`
        const entities = data.mediaIds.map(mediaId => ({"entity": `urn:li:digitalmediaAsset:${mediaId}`}))

        const content = {
            "owner": `urn:li:person:${data.linkedinId}`,
            "distribution": {
                "linkedInDistributionTarget": {
                    "connectionsOnly": false
                }
            },
            "content": {
                "contentEntities": entities,
                "shareMediaCategory": data.mediaCategory
            },
            "text": {
                "text": data.message,
                "annotations": data.mentions || []
            }
        }
        
        /*
        to create mentions:
        
        [
            {
                "entity": "urn:li:organization:2414183",
                "length": 9,
                "start": 6
            }
        ]
        */

        const response = await axios.post(url, content, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })

        return {
            id: `urn:li:share:${response.data.id}`,
            created_at: response.data.created.time,
            url: `https://www.linkedin.com/feed/update/urn:li:share:${response.data.id}`
        }
    }

    static async _ugcPostForVideos(data, token){
        const url = `${LINKEDIN_URLS.API_URL}/ugcPosts`
        
        const content = {
            'author': `urn:li:person:${data.linkedinId}`,
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": data.message
                    },
                    "shareMediaCategory": data.mediaCategory,
                    "media": data.mediaIds.map(mediaId => ({
                        "status": "READY",
                        "media": `urn:li:digitalmediaAsset:${mediaId}`
                    }))
                }
            },
            "visibility": {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        }

        const response = await axios.post(url, content, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })

        return {
            id: response.data.id,
            url: `https://www.linkedin.com/feed/update/${response.data.id}`
        }
    }

    static async uploadMedia(data, token) {
        if (!data.linkedinId) {
            let linkedinData = await this.getBasicInfo(token)
            data.linkedinId = linkedinData.data.id
        }
        
        const media = new Media(token)
        return media.upload(data)
    }

    static async validateMedia(assetId, token) {
        const media = new Media(token)
        return media.validateAsset(assetId)
    }
}

export default Api
