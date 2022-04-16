import { LINKEDIN_URLS } from 'src/config/constants'
import OAuthHelper from 'src/utilities/oauth_helper'


class Auth {
    constructor() {
        this.oauth = new OAuthHelper(
            process.env.LINKEDIN_SCOPES,
            process.env.LINKEDIN_CLIENT_ID,
            process.env.LINKEDIN_REDIRECT_URI,
            process.env.LINKEDIN_CLIENT_SECRET,
            LINKEDIN_URLS
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