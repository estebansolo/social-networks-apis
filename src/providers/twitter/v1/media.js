import { TwitterApi } from 'twitter-api-v2';

class Media {
    constructor(authData) {
        this.twitterApiClient = new TwitterApi({
            appKey: authData.clientId,
            appSecret: authData.clientSecret,
            accessToken: authData.accessToken,
            accessSecret: authData.accessTokenSecret
        });
    }

    async upload(data) {
        const mediaId = await this.twitterApiClient.v1.uploadMedia(data.data, { mimeType: data.mimeType });
        return {
            media_id: mediaId
        }
    }
}

export default Media
