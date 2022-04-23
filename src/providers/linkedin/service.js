import axios from "axios"
import { LINKEDIN_URLS } from "config/constants"
import { parseFriends, parsePostMetrics } from "utilities/parsers"

class Api {
    getBasicInfo(token) {
        const url = `${LINKEDIN_URLS.API_URL}/me`

        return axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    async getConnections(token, linkedinId) {
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

        return parseFriends(response.data, "LINKEDIN")
    }

    async getPostLookup(postId, token) {
        const url = `${LINKEDIN_URLS.API_URL}/socialMetadata/urn:li:share:${postId}`

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return parsePostMetrics(response.data, "LINKEDIN")
    }

}

export default Api
