import axios from "axios"
import Media from "twitter/v1/media"
import OAuthService from "auth/v1/oauthService"
import { Provider } from "src/config/constants"
import { parseFriends, parsePostMetrics, queryParamsSerializer } from "utilities/parsers"

class Api {
    static getBasicInfo(authData) {
        const oauthService = OAuthService.init(Provider.TWITTER, authData)
        const oauthServiceUrls = OAuthService.providerUrls(Provider.TWITTER)
        
        return new Promise((resolve, reject) => {
            oauthService.get(
                oauthServiceUrls.VERIFICATION_TOKEN_URL,
                authData.accessToken,
                authData.accessTokenSecret,
                (error, data, results) => {                    
                    if (error) {
                        return reject(error)
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
                oauthServiceUrls.VERIFICATION_TOKEN_URL,
                authData.accessToken,
                authData.accessTokenSecret,
                (error, data, results) => {                    
                    if (error) {
                        return reject(error)
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
                `${oauthServiceUrls.TWEET_LOOKUP}?id=${tweetId}`,
                authData.accessToken,
                authData.accessTokenSecret,
                (error, data, results) => {                    
                    if (error) {
                        return reject(error)
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

    static async createPost(data, authData) {
        const oauthService = OAuthService.init(Provider.TWITTER, authData)
        const oauthServiceUrls = OAuthService.providerUrls(Provider.TWITTER)

        const parameters = queryParamsSerializer({
            trim_user: true,
            status: data.message,
            media_ids: data.mediaIds.join(',')
        })
        
        return new Promise((resolve, reject) => {
            oauthService.post(
                `${oauthServiceUrls.TWEET_CREATE}?${parameters}`,
                authData.accessToken,
                authData.accessTokenSecret, null, null,
                (error, data, results) => {
                    if (error) {
                        return reject(error)
                    }
                    
                    const response = JSON.parse(data)
                    if ('errors' in response){
                        return reject(data)
                    }
                    
                    resolve({
                        id: response.id,
                        created_at: response.created_at,
                        url: `https://twitter.com/${response.user.id}/status/${response.id}`
                    })
                }
            )
        })
    }

    static async uploadMedia(data, authData) {
        const media = new Media(authData)
        media.upload(data)
    }
}

export default Api
