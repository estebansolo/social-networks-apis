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

    async getAuthCode(code_or_token, refresh_token = false) {
        if (refresh_token) {
            return this.oauth.fetchRefreshToken(code_or_token)
        }

        return this.oauth.fetchToken(code_or_token)
    }
}

export default Auth;