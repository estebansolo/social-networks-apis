import axios from 'axios'
import { TWITTER_URLS } from 'src/config/constants'


class Api {
    constructor() {}

    getBasicInfo(token) {
        const url = `${TWITTER_URLS.API_URL}/users/me?user.fields=id,created_at,name,username,description`

        return axios({
            url,
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
    }

    async getPublicMetrics(token) {
        const url = `${TWITTER_URLS.API_URL}/users/me?user.fields=public_metrics`

        return axios({
            url,
            method: 'get',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
    }
}

export default Api;