import axios from 'axios'
import { TWITTER_URLS } from 'config/constants'


class Api {
    constructor() {}

    getBasicInfo(token) {
        const url = `${TWITTER_URLS.API_URL}/users/me?user.fields=id,created_at,name,username,description`

        return axios({
            url,
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
    }

    async getPublicMetrics(token) {
        const url = `${TWITTER_URLS.API_URL}/users/me?user.fields=public_metrics`

        return axios({
            url,
            method: 'get',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
    }

    async getTweetLookup(tweetId, token, isOlderThan30Days = false) {
        const url = `${TWITTER_URLS.API_URL}/tweets/${tweetId}`
        const tweetFields = isOlderThan30Days ? "public_metrics" : "public_metrics,organic_metrics,non_public_metrics" 

        const response = await axios({
            url,
            method: 'get',
            params: {
                "tweet.fields": tweetFields
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        })

        if ("errors" in response.data && response.data.errors[0].detail.indexOf('older than 30 days') !== 1){
            return this.getTweetLookup(tweetId, token, true)
        }

        return response
    }
}

export default Api;