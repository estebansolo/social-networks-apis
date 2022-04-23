import axios from "axios"
import { TWITTER_URLS } from "src/config/constants"
import { parseFriends, parsePostMetrics } from "utilities/parsers"

class Api {
    getBasicInfo(token) {
        const url = `${TWITTER_URLS.API_URL}/users/me`

        return axios.get(url, {
            params: {
                "user.fields": "id,created_at,name,username,description"
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    async getPublicMetrics(token) {
        const url = `${TWITTER_URLS.API_URL}/users/me`

        const response = await axios.get(url, {
            params: {
                "user.fields": "public_metrics"
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return parseFriends(response.data.data, "TWITTER")
    }

    async getTweetLookup(tweetId, token, isOlderThan30Days = false) {
        const url = `${TWITTER_URLS.API_URL}/tweets/${tweetId}`

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

        return parsePostMetrics(response.data.data, "TWITTER")
    }
}

export default Api
