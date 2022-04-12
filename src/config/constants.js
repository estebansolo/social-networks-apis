export const RESPONSES = {
    MISSING_API_FIELDS: "Missing values for required API fields",
    MISSING_FIELDS_OR_WRONG_INPUTS: "Missing fields or wrong inputs.",
    INVALID_URL_FORMAT: "Invalid URL format",
    AUTHENTICATION_TOKEN_REQUIRED: "Authentication token is required to use the API",
    MISSING_CALLBACK_CODE: "Code parameter is required to perform the authentication operation",
    API_ERROR: "There was an unexpected error with the API"
};

export const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500
}

export const LINKEDIN_URLS = {
    ME_URL: 'https://api.linkedin.com/v2/me',
    SHARE_URL: 'https://api.linkedin.com/v2/shares',
    CONNECTIONS_URL: 'https://api.linkedin.com/v2/connections',
    AUTHORIZATION_URL: 'https://www.linkedin.com/oauth/v2/authorization',
    ACCESS_TOKEN_URL: 'https://www.linkedin.com/oauth/v2/accessToken'
}

export const TWITTER_URLS = {
    REQUEST_TOKEN_URL: 'https://twitter.com/oauth/request_token',
    ACCESS_TOKEN_URL: 'https://twitter.com/oauth/access_token',
    VERIFICATION_TOKEN_URL: 'https://api.twitter.com/1.1/account/verify_credentials.json'
}

export const FACEBOOK_URLS = {
    AUTHORIZATION_URL: 'https://www.facebook.com/v13.0/dialog/oauth',
    ACCESS_TOKEN_URL: 'https://graph.facebook.com/oauth/access_token',
    VERIFICATION_TOKEN_URL: 'https://graph.facebook.com/v13.0/debug_token'
}