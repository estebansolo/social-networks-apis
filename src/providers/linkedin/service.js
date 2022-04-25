import axios from "axios"
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
        const url = `${LINKEDIN_URLS.API_URL}/socialMetadata/urn:li:share:${postId}`

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return parsePostMetrics(response.data, Provider.LINKEDIN)
    }

    static async createPost(data, token, linkedinId) {
        if (!linkedinId) {
            let linkedinData = await this.getBasicInfo(token)
            linkedinId = linkedinData.data.id
        }
    
        const url = `${LINKEDIN_URLS.API_URL}/shares`
        
        const content = {
            "owner": `urn:li:person:${linkedinId}`,
            "distribution": {
                "linkedInDistributionTarget": {
                    "connectionsOnly": false
                }
            },
            "content": {
                "contentEntities": data.entities
            },
            "text": {
                "text": data.message,
                "annotations": data.mentions
            }
        }

        return axios.post(url, content, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
    }
}

export default Api
