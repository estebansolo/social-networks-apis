import qs from "qs"
import axios from "axios"
import { RESPONSES } from "src/config/constants"

class OAuth {
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

    authorizationUrl() {
        if (
            !this.scopes ||
            !this.clientId ||
            !this.redirectUri ||
            !this.clientSecret
        ) {
            return {
                error: RESPONSES.MISSING_API_FIELDS
            }
        }

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

export default OAuth
