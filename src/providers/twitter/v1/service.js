import axios from "axios"
import OAuthService from "auth/v1/oauthService"
import { TWITTER_URLS, Provider } from "src/config/constants"
import { parseFriends, parsePostMetrics } from "utilities/parsers"

class Api {
    static getBasicInfo(authData) {
        const oauthService = OAuthService.init(Provider.TWITTER, authData)
        const oauthServiceUrls = OAuthService.providerUrls(Provider.TWITTER)
        
        return new Promise((resolve, reject) => {
            oauthService.get(
                TWITTER_URLS.V1.VERIFICATION_TOKEN_URL,
                authData.accessToken,
                authData.accessTokenSecret,
                (error, data, results) => {                    
                    if (error) {
                        reject(error)
                    }
                    
                    const response = JSON.parse(data)

                    resolve({
                        id: response.id_str,
                        created_at: response.created_at,
                        description: response.description,
                        username: response.screen_name,
                        name: response.name
                    })
                }
            )
        })
    }

    static async getPublicMetrics(authData) {
        const oauthService = OAuthService.init(Provider.TWITTER, authData)
        const oauthServiceUrls = OAuthService.providerUrls(Provider.TWITTER)
        
        return new Promise((resolve, reject) => {
            oauthService.get(
                TWITTER_URLS.V1.VERIFICATION_TOKEN_URL,
                authData.accessToken,
                authData.accessTokenSecret,
                (error, data, results) => {                    
                    if (error) {
                        reject(error)
                    }
                    
                    const response = JSON.parse(data)

                    resolve({
                        count: null,
                        following: response.friends_count,
                        followers: response.followers_count
                    })
                }
            )
        })
    }

    static async getTweetLookup(tweetId, authData) {
        const oauthService = OAuthService.init(Provider.TWITTER, authData)
        const oauthServiceUrls = OAuthService.providerUrls(Provider.TWITTER)
        
        return new Promise((resolve, reject) => {
            oauthService.get(
                `${TWITTER_URLS.V1.TWEET_LOOKUP}?id=${tweetId}`,
                authData.accessToken,
                authData.accessTokenSecret,
                (error, data, results) => {                    
                    if (error) {
                        reject(error)
                    }
                    
                    const response = JSON.parse(data)
                    
                    resolve({
                        id: response.id_str,
                        url: `https://twitter.com/${response.user.id_str}/status/${response.id_str}`,
                        likes: response.favorite_count,
                        shares: response.retweet_count,
                        comments: 0,
                        reactions: {},
                        extra: {}
                    })
                }
            )
        })
    }
}

export default Api
