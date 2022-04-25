import OAuthService from "auth/v1/oauthService"
import { TWITTER_URLS } from "src/config/constants"

class Auth {
    static getUrl(provider, authData) {
        const oauthService = OAuthService.init(provider, authData)
        const oauthServiceUrls = OAuthService.providerUrls(provider)

        return new Promise((resolve, reject) => {
            oauthService.getOAuthRequestToken(
                (error, oauthToken, oauthTokenSecret, results) => {
                    if (error) {
                        reject(error)
                    }
                    
                    resolve({
                        oauthToken,
                        oauthTokenSecret,
                        url: `${oauthServiceUrls.AUTHENTICATE_URL}${oauthToken}`
                    })
                }
            )
        })
    }

    static getAuthCode(provider, authData) {
        const oauthService = OAuthService.init(provider, authData)

        return new Promise((resolve, reject) => {
            oauthService.getOAuthAccessToken(
                authData.oauthToken,
                null,
                authData.oauthVerifier,
                (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
                    if (error) {
                        reject(error)
                    }

                    resolve({
                        access_token: oauthAccessToken,
                        access_token_secret: oauthAccessTokenSecret
                    })
                }
            )
        })
    }

    static verifyToken(provider, authData) {
        const oauthService = OAuthService.init(provider, authData)
        const oauthServiceUrls = OAuthService.providerUrls(provider)

        return new Promise((resolve, reject) => {
            oauthService.get(
                oauthServiceUrls.VERIFICATION_TOKEN_URL,
                authData.accessToken,
                authData.accessTokenSecret,
                (error, data, response) => {
                    if (error) {
                        reject(error)
                    }

                    resolve(JSON.parse(data))
                }
            )
        })
    }
}

export default Auth
