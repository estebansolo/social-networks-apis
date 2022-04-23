export let RESPONSES = {
    MISSING_API_FIELDS: "Missing values for required API fields",
    MISSING_FIELDS_OR_WRONG_INPUTS: "Missing fields or wrong inputs.",
    INVALID_URL_FORMAT: "Invalid URL format",
    AUTHENTICATION_TOKEN_REQUIRED:
        "Authentication token is required to use the API",
    MISSING_CALLBACK_CODE:
        "Code parameter is required to perform the authentication operation",
    API_ERROR: "There was an unexpected error with the API",
    INVALID_PROVIDER: "Invalid Provider for this request"
}

export let HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500
}

export let VALID_PROVIDERS: string[] = [
    "LINKEDIN",
    "FACEBOOK",
    "TWITTER"
]

export let LINKEDIN_URLS = {
    AUTHORIZATION_URL: "https://www.linkedin.com/oauth/v2/authorization",
    ACCESS_TOKEN_URL: "https://www.linkedin.com/oauth/v2/accessToken",
    API_URL: "https://api.linkedin.com/v2"
}

export let TWITTER_URLS = {
    AUTHORIZATION_URL: "https://twitter.com/i/oauth2/authorize",
    ACCESS_TOKEN_URL: "https://api.twitter.com/2/oauth2/token",
    API_URL: "https://api.twitter.com/2"
}

export let FACEBOOK_URLS = {
    AUTHORIZATION_URL: "https://www.facebook.com/v13.0/dialog/oauth",
    ACCESS_TOKEN_URL: "https://graph.facebook.com/oauth/access_token",
    API_URL: "https://graph.facebook.com/v13.0",
    VERIFICATION_TOKEN_URL: "https://graph.facebook.com/v13.0/debug_token"
}

export let FACEBOOK_REACTIONS: string[] = [
    "LIKE",
    "LOVE",
    "WOW",
    "HAHA",
    "CARE",
    "SAD",
    "ANGRY"
]
