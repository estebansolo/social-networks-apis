import axios from 'axios'
import { LINKEDIN_URLS } from 'src/config/constants'


class Api {
    constructor() {}

    getBasicInfo(token) {
        const url = `${LINKEDIN_URLS.API_URL}/me`

        return axios({
            url,
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
    }

    async getConnections(token, linkedinId) {
        if(!linkedinId){
            let linkedinData = await this.getBasicInfo(token)
            linkedinId = linkedinData.data.id
        }

        const url = `${LINKEDIN_URLS.API_URL}/connections/urn:li:person:${linkedinId}`

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