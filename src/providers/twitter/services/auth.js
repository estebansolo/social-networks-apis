import oauth from 'oauth'
import { TWITTER_URLS } from 'src/config/constants'


class Auth {
    constructor() {
        this.oauth = new oauth.OAuth(
            TWITTER_URLS.REQUEST_TOKEN_URL, TWITTER_URLS.ACCESS_TOKEN_URL,
            process.env.TWITTER_CLIENT_ID, process.env.TWITTER_CLIENT_SECRET,
            "1.0A", process.env.TWITTER_REDIRECT_URI, "HMAC-SHA1"
        );
    }

    getUrl() {
        return new Promise((resolve, reject) => {
            this.oauth.getOAuthRequestToken((error, oauthToken, oauthTokenSecret, results) => {
                if (error) {
                    return reject(error)
                }
                
                resolve({
                    oauthToken,
                    oauthTokenSecret,
                    url: `https://twitter.com/oauth/authenticate?oauth_token=${oauthToken}`
                })
            });
        })
    }

    getAuthCode(oauthToken, oauthVerifier) {
        return new Promise((resolve, reject) => {
            this.oauth.getOAuthAccessToken(
                oauthToken, null, oauthVerifier,
                (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
                    if (error) {
                        return reject(error)
                    }

                    resolve({
                        'access_token': oauthAccessToken,
                        'access_token_secret': oauthAccessTokenSecret
                    })
                }
            );
        })
    }

    verifyToken(accessToken, accessTokenSecret) {
        return new Promise((resolve, reject) => {
            this.oauth.get(TWITTER_URLS.VERIFICATION_TOKEN_URL, '1038054131381035008-Wgn11gDY76co6PHHzYqEM0tZ8Xn6Xr', accessTokenSecret, (error, data, response) => {
                if (error) {
                    return reject(error)
                }
                
                resolve(JSON.parse(data))
            });
        })
    }
}

export default Auth;