import qs from 'qs'
import axios from 'axios'
import { LINKEDIN } from 'src/config/constants'


class Auth {
    constructor() {
        this.scopes = process.env.LINKEDIN_SCOPES
        this.client_id = process.env.LINKEDIN_CLIENT_ID
        this.redirect_uri = process.env.LINKEDIN_REDIRECT_URI
        this.client_secret = process.env.LINKEDIN_CLIENT_SECRET
    }

    getUrl() {
        if (!this.scopes || !this.client_id || !this.redirect_uri || !this.client_secret) {
            return Promise.reject()
        }

        const scope = encodeURIComponent(this.scopes);
        const redirectUrl = encodeURIComponent(this.redirect_uri)

        return Promise.resolve({
            'url': `${LINKEDIN.AUTHORIZATION_URL}?response_type=code&client_id=${this.client_id}&redirect_uri=${redirectUrl}&scope=${scope}`
        }) 
    }

    getAuthCode(code_or_token, refresh_token = false) {
        const refresh_token_data = {
            refresh_token: code_or_token,
            grant_type: 'refresh_token',
            client_id: this.client_id,
            client_secret: this.client_secret
        }

        const access_token_data = {
            code: code_or_token,
            grant_type: 'authorization_code',
            client_id: this.client_id,
            redirect_uri: this.redirect_uri,
            client_secret: this.client_secret
        }

        const data = qs.stringify(refresh_token ? refresh_token_data : access_token_data)
        
        return axios({
            data,
            method: 'post',
            url: LINKEDIN.ACCESS_TOKEN_URL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    }
}

export default Auth;