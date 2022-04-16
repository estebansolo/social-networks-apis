import OAuthHelper from 'src/utilities/oauth_helper'
import { TWITTER_URLS } from 'src/config/constants'


class Auth {
    constructor() {
        this.oauth = new OAuthHelper(
            process.env.TWITTER_SCOPES,
            process.env.TWITTER_CLIENT_ID,
            process.env.TWITTER_REDIRECT_URI,
            process.env.TWITTER_CLIENT_SECRET,
            TWITTER_URLS,
            true
        )
    }

    getUrl() {
        return this.oauth.authorizationUrl()
    }

    getAuthCode(codeOrToken, isRefreshToken = false) {
        if (isRefreshToken) {
            return this.oauth.fetchRefreshToken(codeOrToken)
        }

        return this.oauth.fetchToken(codeOrToken)
    }
}

export default Auth;