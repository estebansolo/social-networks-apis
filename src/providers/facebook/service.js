import axios from "axios"
import { FACEBOOK_URLS, FacebookReaction, Provider } from "src/config/constants"
import { parseFriends, parsePostMetrics } from "utilities/parsers"

class Api {
    static getBasicInfo(token) {
        const url = `${FACEBOOK_URLS.API_URL}/me`

        return axios.get(url, {
            params: {
                fields: "id,name,email,gender",
                access_token: token
            }
        })
    }

    static async getFriends(token, facebookId) {
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

        return parseFriends(response.data, Provider.FACEBOOK)
    }

    static async getPosts(facebookId, token, followUrl = null) {
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

    static async getPostLookup(postId, facebookId, token) {
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

        return parsePostMetrics(responseData, Provider.FACEBOOK)
    }

    static async reactionsByType(url, token) {
        const requests = []

        for (const reaction in FacebookReaction) {
            console.log(reaction)
            const reactionRequest = await axios
                .get(url, {
                    params: {
                        access_token: token,
                        fields: `reactions.limit(0).type(${reaction}).summary(total_count)`
                    }
                })
                .then(response => {
                    return {
                        reaction: reaction,
                        total: response.data.reactions.summary.total_count
                    }
                })

            requests.push(reactionRequest)
        }

        return await Promise.all(requests)
    }
}

export default Api
