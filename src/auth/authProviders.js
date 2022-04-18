import OAuth from "utilities/oauth"
import { TWITTER_URLS, FACEBOOK_URLS, LINKEDIN_URLS } from "config/constants"

export default {
    TWITTER: new OAuth(
        process.env.TWITTER_SCOPES,
        process.env.TWITTER_CLIENT_ID,
        process.env.TWITTER_REDIRECT_URI,
        process.env.TWITTER_CLIENT_SECRET,
        TWITTER_URLS,
        true,
        true
    ),
    FACEBOOK: new OAuth(
        process.env.FACEBOOK_SCOPES,
        process.env.FACEBOOK_CLIENT_ID,
        process.env.FACEBOOK_REDIRECT_URI,
        process.env.FACEBOOK_CLIENT_SECRET,
        FACEBOOK_URLS,
        false
    ),
    LINKEDIN: new OAuth(
        process.env.LINKEDIN_SCOPES,
        process.env.LINKEDIN_CLIENT_ID,
        process.env.LINKEDIN_REDIRECT_URI,
        process.env.LINKEDIN_CLIENT_SECRET,
        LINKEDIN_URLS
    )
}
