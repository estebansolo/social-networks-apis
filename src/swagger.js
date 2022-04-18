export default {
  "swagger": "2.0",
  "info": {
    "description": "Service to use different social networks APIs from a single source",
    "version": "1.0.0",
    "title": "Social Networks API",
    "contact": {
      "email": "estebansolorzano27@gmail.com"
    }
  },
  "tags": [
    {
      "name": "linkedin",
      "externalDocs": {
        "description": "Find out more",
        "url": "https://docs.microsoft.com/en-us/linkedin/marketing/"
      }
    },
    {
      "name": "facebook",
      "externalDocs": {
        "description": "Find out more",
        "url": "https://developers.facebook.com/docs/graph-api/overview"
      }
    },
    {
      "name": "twitter",
      "externalDocs": {
        "description": "Find out more",
        "url": "https://developer.twitter.com/en/docs/twitter-api"
      }
    }
  ],
  "paths": {
    "/auth/{provider}": {
      "get": {
        "tags": [
          "linkedin",
          "twitter",
          "facebook"
        ],
        "summary": "Retrieve authenticator URL",
        "description": "Generate an authenticator URL for Provider's API connection",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "provider",
            "in": "path",
            "description": "Provider name to use the API",
            "required": true,
            "type": "string",
            "enum": [
              "linkedin",
              "facebook",
              "twitter"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/AuthenticatorURL"
            }
          },
          "400": {
            "description": "Invalid provider value",
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
    "/auth/linkedin/callback": {
      "get": {
        "tags": [
          "linkedin"
        ],
        "summary": "Authenticator URL Callback",
        "description": "Generate authentication tokens for API",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "code",
            "in": "query",
            "description": "callback code from LinkedIn API to Generate authentication tokens",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/LinkedInAuthenticationToken"
            }
          },
          "400": {
            "description": "Bad request or missing required fields",
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "401": {
            "description": "API Error",
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
    "/auth/linkedin/refresh_token": {
      "put": {
        "tags": [
          "linkedin"
        ],
        "summary": "Refresh access token",
        "description": "Generate new authentication tokens for the API",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Refresh token required to update authentication code",
            "required": true,
            "schema": {
              "$ref": "#/definitions/RefreshToken"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/LinkedInAuthenticationToken"
            }
          },
          "400": {
            "description": "Bad request or missing required fields",
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "401": {
            "description": "Invalid refresh_token value",
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
    "/api/linkedin/me": {
      "get": {
        "tags": [
          "linkedin"
        ],
        "summary": "",
        "description": "",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "query",
            "description": "Token required to use the LinkedIn API",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/LinkedInMe"
            }
          },
          "400": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "401": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "500": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
    "/api/linkedin/connections": {
      "get": {
        "tags": [
          "linkedin"
        ],
        "summary": "",
        "description": "",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "query",
            "description": "Token required to use the LinkedIn API",
            "required": true,
            "type": "string"
          },
          {
            "name": "linkedin_id",
            "in": "query",
            "description": "LinkedIn ID of the user to perform the action",
            "required": false,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/UserFriends"
            }
          },
          "400": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "401": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "500": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
    "/api/linkedin/posts/{id}": {
      "get": {
        "tags": [
          "linkedin"
        ],
        "summary": "",
        "description": "",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "ID of Post to return",
            "required": true,
            "type": "string"
          },
          {
            "name": "token",
            "in": "query",
            "description": "Token required to use the LinkedIn API",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/PostReach"
            }
          },
          "400": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "401": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "500": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
    "/auth/twitter/callback": {
      "get": {
        "tags": [
          "twitter"
        ],
        "summary": "Authenticator URL Callback",
        "description": "Generate authentication tokens for API",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "code",
            "in": "query",
            "description": "callback code from Twitter API to Generate authentication tokens",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/TwitterAuthenticationToken"
            }
          },
          "400": {
            "description": "Bad request or missing required fields",
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "401": {
            "description": "API Error",
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
    "/auth/twitter/refresh_token": {
      "put": {
        "tags": [
          "twitter"
        ],
        "summary": "Refresh access token",
        "description": "Generate new authentication tokens for the API",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Refresh token required to update authentication code",
            "required": true,
            "schema": {
              "$ref": "#/definitions/RefreshToken"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/TwitterAuthenticationToken"
            }
          },
          "400": {
            "description": "Bad request or missing required fields",
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "401": {
            "description": "Invalid refresh_token value",
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
    "/api/twitter/me": {
      "get": {
        "tags": [
          "twitter"
        ],
        "summary": "",
        "description": "",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "query",
            "description": "Token required to use the Twitter API",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/TwitterMe"
            }
          },
          "400": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "401": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "500": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
    "/api/twitter/metrics": {
      "get": {
        "tags": [
          "twitter"
        ],
        "summary": "",
        "description": "",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "query",
            "description": "Token required to use the Twitter API",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/UserFriends"
            }
          },
          "400": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "401": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "500": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
    "/api/twitter/posts/{id}": {
      "get": {
        "tags": [
          "twitter"
        ],
        "summary": "",
        "description": "",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "ID of Post to return",
            "required": true,
            "type": "string"
          },
          {
            "name": "token",
            "in": "query",
            "description": "Token required to use the Twitter API",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/PostReach"
            }
          },
          "400": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "401": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "500": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
    "/auth/facebook/callback": {
      "get": {
        "tags": [
          "facebook"
        ],
        "summary": "Authenticator URL Callback",
        "description": "Generate authentication tokens for API",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "code",
            "in": "query",
            "description": "callback code from Facebook API to Generate authentication tokens",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/FacebookAuthenticationToken"
            }
          },
          "400": {
            "description": "Bad request or missing required fields",
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "401": {
            "description": "API Error",
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
    "/auth/facebook/verify_token": {
      "get": {
        "tags": [
          "facebook"
        ],
        "summary": "Verify access token",
        "description": "Check status of the provided API token",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "query",
            "description": "Access token required to use the Facebook API",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/FacebookVerificationToken"
            }
          },
          "400": {
            "description": "Bad request or missing required fields",
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "401": {
            "description": "Invalid refresh_token value",
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
    "/api/facebook/me": {
      "get": {
        "tags": [
          "facebook"
        ],
        "summary": "",
        "description": "",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "query",
            "description": "Token required to use the Facebook API",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/FacebookMe"
            }
          },
          "400": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "401": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "500": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
    "/api/facebook/friends": {
      "get": {
        "tags": [
          "facebook"
        ],
        "summary": "",
        "description": "",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "query",
            "description": "Token required to use the Facebook API",
            "required": true,
            "type": "string"
          },
          {
            "name": "facebook_id",
            "in": "query",
            "description": "Facebook ID of the user to perform the action",
            "required": false,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/UserFriends"
            }
          },
          "400": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "401": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "500": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
    "/api/facebook/posts/{id}": {
      "get": {
        "tags": [
          "facebook"
        ],
        "summary": "",
        "description": "",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "ID of Post to return",
            "required": true,
            "type": "string"
          },
          {
            "name": "token",
            "in": "query",
            "description": "Token required to use the Facebook API",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/PostReach"
            }
          },
          "400": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "401": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          },
          "500": {
            "schema": {
              "$ref": "#/definitions/SingleError"
            }
          }
        }
      }
    },
  },
  "definitions": {
    "AuthenticatorURL": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string"
        }
      }
    },
    "SingleError": {
      "type": "object",
      "properties": {
        "error": {
          "type": "string"
        }
      }
    },
    "LinkedInAuthenticationToken": {
      "type": "object",
      "properties": {
        "access_token": {
          "type": "string"
        },
        "expires_in": {
          "type": "integer",
          "format": "int32"
        },
        "refresh_token": {
          "type": "string"
        },
        "refresh_token_expires_in": {
          "type": "integer",
          "format": "int32"
        }
      }
    },
    "TwitterAuthenticationToken": {
      "type": "object",
      "properties": {
        "access_token": {
          "type": "string"
        },
        "expires_in": {
          "type": "integer",
          "format": "int32"
        },
        "refresh_token": {
          "type": "string"
        },
        "scope": {
          "type": "string"
        },
        "token_type": {
          "type": "string"
        }
      }
    },
    "FacebookAuthenticationToken": {
      "type": "object",
      "properties": {
        "access_token": {
          "type": "string"
        },
        "expires_in": {
          "type": "integer",
          "format": "int32"
        },
        "token_type": {
          "type": "string"
        }
      }
    },
    "RefreshToken": {
      "type": "object",
      "properties": {
        "refresh_token": {
          "type": "string"
        }
      }
    },
    "FacebookVerificationToken": {
      "type": "object",
      "properties": {
        "app_id": {
          "type": "string"
        },
        "type": {
          "type": "string"
        },
        "application": {
          "type": "string"
        },
        "data_access_expires_at": {
          "type": "integer",
          "format": "int32"
        },
        "expires_at": {
          "type": "integer",
          "format": "int32"
        },
        "issued_at": {
          "type": "integer",
          "format": "int32"
        },
        "is_valid": {
          "type": "boolean"
        },
        "user_id": {
          "type": "string"
        },
        "scopes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Scopes"
          }
        }
      }
    },
    "Scopes": {
      "type": "string"
    },
    "UserFriends": {
      "type": "object",
      "properties": {
        "count": {
          "type": "integer",
          "format": "int32"
        },
        "following": {
          "type": "integer",
          "format": "int32"
        },
        "followers": {
          "type": "integer",
          "format": "int32"
        },
      }
    },
    "FacebookMe": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
      }
    },
    "TwitterMe": {
      "type": "object",
      "properties": {
        "created_at": {
          "type": "string"
        },
        "username": {
          "type": "string"
        },
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
      }
    },
    "LinkedInMe": {
      "type": "object",
      "properties": {
        "localizedFirstName": {
          "type": "string"
        },
        "localizedLastName": {
          "type": "string"
        },
        "vanityName": {
          "type": "string"
        },
        "localizedHeadline": {
          "type": "string"
        },
        "id": {
          "type": "string"
        },
      }
    },
    "PostReach": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "url": {
          "type": "string"
        },
        "likes": {
          "type": "integer",
          "format": "int32"
        },
        "shares": {
          "type": "integer",
          "format": "int32"
        },
        "comments": {
          "type": "integer",
          "format": "int32"
        },
        "reactions": {
          "type": "object"
        },
        "extra": {
          "type": "object",
          "example": "Here comes an object for Twitter API if the post is less than 30 days with more reach info"
        },
      }
    }
  }
}