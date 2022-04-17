import axios from 'axios'
import { FACEBOOK_URLS } from 'config/constants'


class Api {
    constructor() {}

    getBasicInfo(token) {
        const url = `${FACEBOOK_URLS.API_URL}/me`

        return axios.get(url, {
            params: {
                fields: 'id,name,email,gender',
                access_token: token
            }
        })
    }

    async getFriends(token, facebookId) {
        if(!facebookId){
            let facebookData = await this.getBasicInfo(token)
            facebookId = facebookData.data.id
        }

        const url = `${FACEBOOK_URLS.API_URL}/${facebookId}/friends`

        return axios.get(url, {
            params: {
                access_token: token
            }
        })
    }
    
    async getPostLookup(postId, token) {
        let facebookData = await this.getBasicInfo(token)
        const facebookId = facebookData.data.id

        const url = `${FACEBOOK_URLS.API_URL}/${facebookId}_${postId}/insights`
        console.log(url)
        //type LIKE, LOVE, WOW, HAHA, SORRY, ANGRY
        return axios.get(url, {
            params: {
                access_token: token,
                fields: [
                    "id,message,created_time",
                    "reactions.limit(0).summary(total_count)",
                    "comments.limit(0).summary(total_count)",
                    "shares",
                ].join(',')
            }
        })
    }
}

export default Api;