import { FACEBOOK_URLS } from 'src/config/constants'
import OAuthHelper from 'src/utilities/oauth_helper'


class Auth {
    constructor() {
        this.oauth = new OAuthHelper(
            process.env.FACEBOOK_SCOPES,
            process.env.FACEBOOK_CLIENT_ID,
            process.env.FACEBOOK_REDIRECT_URI,
            process.env.FACEBOOK_CLIENT_SECRET,
            FACEBOOK_URLS
        )
    }

    getUrl() {
        return this.oauth.authorizationUrl()
    }

    getAuthCode(code) {
        return this.oauth.fetchToken(code)
    }

    verifyToken(token) {
        return this.oauth.verifyToken(token)
    }
}

export default Auth;