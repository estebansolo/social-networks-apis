export const TWITTER_URLS = {
    V1: {
        REQUEST_TOKEN_URL: "https://twitter.com/oauth/request_token",
        ACCESS_TOKEN_URL: "https://twitter.com/oauth/access_token",
        VERIFICATION_TOKEN_URL:
            "https://api.twitter.com/1.1/account/verify_credentials.json",
        AUTHENTICATE_URL: "https://twitter.com/oauth/authenticate?oauth_token="
    },
    V2: {
        AUTHORIZATION_URL: "https://twitter.com/i/oauth2/authorize",
        ACCESS_TOKEN_URL: "https://api.twitter.com/2/oauth2/token",
        API_URL: "https://api.twitter.com/2"
    }
}

export const LINKEDIN_URLS = {
    AUTHORIZATION_URL: "https://www.linkedin.com/oauth/v2/authorization",
    ACCESS_TOKEN_URL: "https://www.linkedin.com/oauth/v2/accessToken",
    API_URL: "https://api.linkedin.com/v2"
}

export const FACEBOOK_URLS = {
    AUTHORIZATION_URL: "https://www.facebook.com/v13.0/dialog/oauth",
    ACCESS_TOKEN_URL: "https://graph.facebook.com/oauth/access_token",
    API_URL: "https://graph.facebook.com/v13.0",
    VERIFICATION_TOKEN_URL: "https://graph.facebook.com/v13.0/debug_token"
}

export enum Provider {
    TWITTER = "TWITTER",
    LINKEDIN = "LINKEDIN",
    FACEBOOK = "FACEBOOK"
}

export enum HttpStatus {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    INTERNAL_SERVER_ERROR = 500
}

export enum FacebookReactions {
    LIKE = "LIKE",
    LOVE = "LOVE",
    WOW = "WOW",
    HAHA = "HAHA",
    CARE = "CARE",
    SAD = "SAD",
    ANGRY = "ANGRY"
}
