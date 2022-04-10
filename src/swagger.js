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
    }
  ],
  "paths": {
    "/linkedin/auth": {
      "get": {
        "tags": [
          "linkedin"
        ],
        "summary": "Retrieve authenticator URL",
        "description": "Generate an authenticator URL for LinkedIn API connection",
        "produces": [
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "Successful Operation",
            "schema": {
              "$ref": "#/definitions/AuthenticatorURL"
            }
          },
          "500": {
            "description": "Invalid status value",
            "schema": {
              "$ref": "#/definitions/ErrorMissingFields"
            }
          }
        }
      }
    },
    "/linkedin/auth/callback": {
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
              "$ref": "#/definitions/AuthenticationToken"
            }
          },
          "400": {
            "description": "Missing code parameter",
            "schema": {
              "$ref": "#/definitions/ErrorMissingCode"
            }
          },
          "401": {
            "description": "Invalid code value",
            "schema": {
              "$ref": "#/definitions/ErrorInvalidCode"
            }
          }
        }
      }
    },
    "/linkedin/auth/refresh_token": {
      "put": {
        "tags": [
          "linkedin"
        ],
        "summary": "Authenticator URL Callback",
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
              "$ref": "#/definitions/AuthenticationToken"
            }
          },
          "400": {
            "description": "Missing refresh_token value",
            "schema": {
              "$ref": "#/definitions/ErrorMissingCode"
            }
          },
          "401": {
            "description": "Invalid refresh_token value",
            "schema": {
              "$ref": "#/definitions/ErrorInvalidCode"
            }
          }
        }
      }
    }
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
    "AuthenticationToken": {
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
    "RefreshToken": {
      "type": "object",
      "properties": {
        "refresh_token": {
          "type": "string"
        }
      }
    },
    "ErrorMissingCode": {
      "type": "object",
      "properties": {
        "error": {
          "type": "string"
        }
      }
    },
    "ErrorInvalidCode": {
      "type": "object",
      "properties": {
        "error": {
          "type": "string"
        },
        "error_description": {
          "type": "string"
        }
      }
    },
    "ErrorMissingFields": {
      "type": "object",
      "properties": {
        "error": {
          "type": "string"
        }
      }
    }
  }
}