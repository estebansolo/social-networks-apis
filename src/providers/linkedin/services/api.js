import axios from 'axios'
import { LINKEDIN } from 'src/config/constants'


class Api {
    constructor() {
        this.connections_url = `${LINKEDIN.CONNECTIONS_URL}/urn:li:person:`
    }

    getLinkedInId(token) {
        return axios({
            method: 'get',
            url: LINKEDIN.ME_URL,
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
    }

    async getConnections(token, linkedinId) {
        if(!linkedinId){
            let linkedinId = await this.getLinkedInId(token)
            linkedinId = linkedinId.data.id
        }

        return axios({
            method: 'get',
            url: `${this.connections_url}${linkedinId}`,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
    }
}

export default Api;