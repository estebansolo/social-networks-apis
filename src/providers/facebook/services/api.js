import axios from 'axios'
import { FACEBOOK_URLS } from 'src/config/constants'


class Api {
    constructor() {}

    getBasicInfo(token) {
        const url = `${FACEBOOK_URLS.API_URL}/me`

        return axios.get(url, {
            params: {
                fields: 'id,name,email,gender',
                access_token: token
            }
        })
    }

    async getFriends(token, facebookId) {
        if(!facebookId){
            let facebookData = await this.getBasicInfo(token)
            facebookId = facebookData.data.id
        }

        const url = `${FACEBOOK_URLS.API_URL}/${facebookId}/friends`

        return axios.get(url, {
            params: {
                access_token: token
            }
        })
    }
}

export default Api;