import OAuthService from "auth/v2/oauthService"

class Auth {
    static getUrl(provider, authData) {
        const oauthService = OAuthService.init(provider, authData)
        return oauthService.authorizationUrl()
    }

    static getAuthCode(provider, authData) {
        const oauthService = OAuthService.init(provider, authData)

        if (authData.token !== undefined) {
            return oauthService.fetchRefreshToken(authData.token)
        }

        return oauthService.fetchToken(authData.code)
    }

    static verifyToken(provider, authData) {
        const oauthService = OAuthService.init(provider, authData)
        return oauthService.verifyToken(authData.token)
    }
}

export default Auth
