import axios from "axios"
import { FACEBOOK_URLS, FACEBOOK_REACTIONS } from "config/constants"
import { parseFriends, parsePostMetrics } from "utilities/parsers"

class Api {
    getBasicInfo(token) {
        const url = `${FACEBOOK_URLS.API_URL}/me`

        return axios.get(url, {
            params: {
                fields: "id,name,email,gender",
                access_token: token
            }
        })
    }

    async getFriends(token, facebookId) {
        if (!facebookId) {
            let facebookData = await this.getBasicInfo(token)
            facebookId = facebookData.data.id
        }

        const url = `${FACEBOOK_URLS.API_URL}/${facebookId}/friends`

        const response = await axios.get(url, {
            params: {
                access_token: token
            }
        })

        return parseFriends(response.data, "FACEBOOK")
    }

    async getPostLookup(postId, facebookId, token) {
        if (!facebookId) {
            let facebookData = await this.getBasicInfo(token)
            facebookId = facebookData.data.id
        }

        const url = `${FACEBOOK_URLS.API_URL}/${facebookId}_${postId}`

        const response = await axios.get(url, {
            params: {
                access_token: token,
                fields: `id,message,permalink_url,created_time,comments.limit(0).summary(total_count),shares`
            }
        })

        const responseData = response.data
        responseData.reactions = await this.reactionsByType(url, token)

        return parsePostMetrics(responseData, "FACEBOOK")
    }

    async getPosts(facebookId, token, followUrl = null) {
        if (!followUrl){
            if (!facebookId) {
                let facebookData = await this.getBasicInfo(token)
                facebookId = facebookData.data.id
            }
    
            followUrl = `${FACEBOOK_URLS.API_URL}/${facebookId}/posts`
        }

        return axios.get(followUrl, {
            params: {
                access_token: token,
                fields: `id,created_time,message,link,name,permalink_url,source,type`
            }
        })
    }

    async reactionsByType(url, token) {
        const requests = []

        for (const reaction in FACEBOOK_REACTIONS) {
            const reactionRequest = await axios
                .get(url, {
                    params: {
                        access_token: token,
                        fields: `reactions.limit(0).type(${FACEBOOK_REACTIONS[reaction]}).summary(total_count)`
                    }
                })
                .then(response => {
                    return {
                        reaction: FACEBOOK_REACTIONS[reaction],
                        total: response.data.reactions.summary.total_count
                    }
                })

            requests.push(reactionRequest)
        }

        return await Promise.all(requests)
    }
}

export default Api
