import qs from 'qs'
import axios from 'axios'
import { RESPONSES } from "src/config/constants";


class OAuthHelper {
    constructor(scopes, client_id, redirect_uri, client_secret, oauth_urls) {
        if (!scopes || !client_id || !redirect_uri || !client_secret) {
            throw RESPONSES.MISSING_API_FIELDS
        }

        this.scopes = scopes
        this.client_id = client_id
        this.redirect_uri = redirect_uri
        this.client_secret = client_secret
        this.oauth_urls = oauth_urls
    }

    authorizationUrl() {
        const scope = encodeURIComponent(this.scopes);
        const redirectUrl = encodeURIComponent(this.redirect_uri)

        return {
            'url': `${this.oauth_urls.AUTHORIZATION_URL}?response_type=code&client_id=${this.client_id}&redirect_uri=${redirectUrl}&scope=${scope}`
        }
    }

    fetchToken(code) {
        const data = {
            code: code,
            client_id: this.client_id,
            redirect_uri: this.redirect_uri,
            client_secret: this.client_secret,
            grant_type: 'authorization_code'
        }
        
        return axios({
            method: 'post',
            data: qs.stringify(data),
            url: this.oauth_urls.ACCESS_TOKEN_URL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    }

    fetchRefreshToken(code) {
        const data = {
            refresh_token: code,
            client_id: this.client_id,
            client_secret: this.client_secret,
            grant_type: 'refresh_token'
        }
        
        return axios({
            method: 'post',
            data: qs.stringify(data),
            url: this.oauth_urls.ACCESS_TOKEN_URL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    }

    verifyToken(token) {
        return axios({
            method: 'get',
            url: `${this.oauth_urls.VERIFICATION_TOKEN_URL}?input_token=${token}&access_token=${this.client_id}|${this.client_secret}`
        })
    }
}

export default OAuthHelper