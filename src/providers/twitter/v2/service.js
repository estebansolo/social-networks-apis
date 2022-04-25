import axios from "axios"
import { TWITTER_URLS, Provider } from "src/config/constants"
import { parseFriends, parsePostMetrics } from "utilities/parsers"

class Api {
    static getBasicInfo(token) {
        const url = `${TWITTER_URLS.V2.API_URL}/users/me`

        return axios.get(url, {
            params: {
                "user.fields": "id,created_at,name,username,description"
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    static async getPublicMetrics(token) {
        const url = `${TWITTER_URLS.V2.API_URL}/users/me`

        const response = await axios.get(url, {
            params: {
                "user.fields": "public_metrics"
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return parseFriends(response.data.data, Provider.TWITTER)
    }

    static async getTweetLookup(tweetId, token, isOlderThan30Days = false) {
        const url = `${TWITTER_URLS.V2.API_URL}/tweets/${tweetId}`

        const response = await axios.get(url, {
            params: {
                "tweet.fields": isOlderThan30Days
                    ? "public_metrics,author_id"
                    : "public_metrics,author_id,organic_metrics,non_public_metrics"
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json"
            }
        })

        if (
            "errors" in response.data &&
            response.data.errors[0].detail.indexOf("older than 30 days") !== 1
        ) {
            return this.getTweetLookup(tweetId, token, true)
        }

        return parsePostMetrics(response.data.data, Provider.TWITTER)
    }
}

export default Api
