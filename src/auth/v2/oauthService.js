import qs from "qs"
import axios from "axios"
import { Provider } from "src/config/constants"
import { TWITTER_URLS, FACEBOOK_URLS, LINKEDIN_URLS } from "src/config/constants"


class OAuthService {
    /* Helper for OAuth V2 Applications */

    complement = ""

    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    constructor(
        scopes,
        clientId,
        redirectUri,
        clientSecret,
        urls,
        useAuthentication = false,
        useComplement = false
    ) {
        this.urls = urls
        this.scopes = scopes
        this.clientId = clientId
        this.redirectUri = redirectUri
        this.clientSecret = clientSecret

        if (useAuthentication) {
            const authClient = Buffer.from(
                `${this.clientId}:${this.clientSecret}`
            ).toString("base64")
            this.headers["Authorization"] = `Basic ${authClient}`
        }

        if (useComplement) {
            // TODO: Improve this according to the OAuth2 Standards
            // https://www.oauth.com/oauth2-servers/pkce/authorization-request/
            this.complement =
                "&state=state&code_challenge=challenge&code_challenge_method=plain"
        }
    }

    static init(provider, authData){
        const oauthScopes = OAuthService.providerScopes(provider)
        const oauthServiceUrls = OAuthService.providerUrls(provider)

        return new OAuthService(
            oauthScopes,
            authData.clientId,
            authData.redirectUri,
            authData.clientSecret,
            oauthServiceUrls,
            provider == Provider.TWITTER,
            provider == Provider.TWITTER
        )
    }

    static providerUrls(provider){
        const dataProviders = {
            FACEBOOK: FACEBOOK_URLS,
            LINKEDIN: LINKEDIN_URLS,
            TWITTER: TWITTER_URLS.V2
        }

        return dataProviders[provider]
    }

    static providerScopes(provider){
        const dataProviders = {
            TWITTER: process.env.TWITTER_SCOPES,
            FACEBOOK: process.env.FACEBOOK_SCOPES,
            LINKEDIN: process.env.LINKEDIN_SCOPES
        }

        return dataProviders[provider]
    }

    authorizationUrl() {
        const scope = encodeURIComponent(this.scopes)
        const redirectUrl = encodeURIComponent(this.redirectUri)

        return {
            url: `${this.urls.AUTHORIZATION_URL}?response_type=code&client_id=${this.clientId}&redirect_uri=${redirectUrl}&scope=${scope}${this.complement}`
        }
    }

    fetchToken(code) {
        const data = {
            code: code,
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            client_secret: this.clientSecret,
            grant_type: "authorization_code",
            code_verifier: "challenge" // TODO: Update with standards
        }

        return axios({
            method: "post",
            data: qs.stringify(data),
            url: this.urls.ACCESS_TOKEN_URL,
            headers: this.headers
        })
    }

    fetchRefreshToken(code) {
        const data = {
            refresh_token: code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: "refresh_token"
        }

        return axios({
            method: "post",
            data: qs.stringify(data),
            url: this.urls.ACCESS_TOKEN_URL,
            headers: this.headers
        })
    }

    verifyToken(token) {
        return axios.get(this.urls.VERIFICATION_TOKEN_URL, {
            params: {
                input_token: token,
                access_token: `${this.clientId}|${this.clientSecret}`
            }
        })
    }
}

export default OAuthService
