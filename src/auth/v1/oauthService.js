import oauth from "oauth"
import { TWITTER_URLS } from "src/config/constants"


class OAuthService {
    static init(provider, authData){
        const oauthServiceUrls = OAuthService.providerUrls(provider)

        return new oauth.OAuth(
            oauthServiceUrls.REQUEST_TOKEN_URL,
            oauthServiceUrls.ACCESS_TOKEN_URL,
            authData.clientId,
            authData.clientSecret,
            "1.0A",
            authData.redirectUri,
            "HMAC-SHA1"
        )
    }

    static providerUrls(provider){
        const dataProviders = {
            TWITTER: TWITTER_URLS.V1
        }

        return dataProviders[provider]
    }
}


export default OAuthService
