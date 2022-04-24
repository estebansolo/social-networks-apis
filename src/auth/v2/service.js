import authProviders from "auth/v2/authProviders"

class Auth {
    setProvider(provider) {
        this.oauth = authProviders[provider]
        return this
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

    verifyToken(token) {
        return this.oauth.verifyToken(token)
    }
}

export default Auth
