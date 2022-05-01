import { Provider, TWITTER_CHUNK_SIZE } from "src/config/constants"
import OAuthService from "auth/v1/oauthService"
import { extractError, splitBuffer } from "src/utilities"
import { queryParamsSerializer } from "utilities/parsers"

class Media {
    constructor(authData) {
        this.authData = authData
        this.oauthService = OAuthService.init(Provider.TWITTER, authData)
        this.oauthServiceUrls = OAuthService.providerUrls(Provider.TWITTER)
    }

    upload(data) {
        return Promise.resolve()
            .then(() => {
                return this._request({media: data.data})
            })
            .catch(error => {
                console.log(error, "error")
            })



        return Promise.resolve()
            .then(() => {
                return this._init(data.size, data.mimeType)
            })
            .then(mediaId => {
                return this._finalize(mediaId)
                return this._append(mediaId, data.data)
            })
            .then(mediaId => {
                return this._finalize(mediaId)
            })
            .catch(error => {
                console.log(error, "error")
            })
    }

    _init(size, mimeType) {
        const params = {
            command: "INIT",
            total_bytes: size,
            media_type: mimeType
        }

        return this._request(params).then(json => json.media_id)
    }

    _append(mediaId, fileData) {
        const params = (filePart, segmentIndex) => {
            return {
                command: "APPEND",
                media_id: mediaId,
                media_data: filePart,
                segment_index: segmentIndex
            }
        }

        const fileParts = splitBuffer(fileData, TWITTER_CHUNK_SIZE)
        const uploads = fileParts.map((filePart, index) =>
            this._request(params(filePart, index))
        )
        console.log(uploads)
        return Promise.all(uploads)
            .then(() => {
                console.log(mediaId, "asd")
                return mediaId
            })
            .catch(e => {
                console.log(e, "qwe")
            })
    }

    _finalize(mediaId) {
        const params = {
            command: "FINALIZE",
            media_id: mediaId
        }

        return this._request(params).then(json => this._validateFinished(json))
    }

    _checkUploadStatus(mediaID) {
        const params = {
            method: "GET",
            qs: {
                command: "STATUS",
                media_id: mediaID
            }
        }

        return this._request(params).then(json =>
            this._validateUploadFinished(json)
        )
    }

    _validateUploadFinished(response) {
        const { media_id_string: mediaID, processing_info: processingInfo } =
            response || {}
        console.log(response)
        /*
        const { state, check_after_secs: delayInSeconds } = processingInfo || {};

        var isComplete = new Set(['succeeded', 'failed']).has(state);
        var hasFailed = state === 'failed';

        if (!isComplete) {
            return new Promise((resolve) => {
                setTimeout(resolve, delayInSeconds * 1000);
            }).then(() => {
                return this._checkUploadStatus(mediaID);
            });
        } else if (hasFailed) {
            return Promise.reject(response);
        } else {
            return Promise.resolve(response);
        }
        */
    }

    _request(params) {
        console.log(params)
        return new Promise((resolve, reject) => {
            this.oauthService.post(
                this.oauthServiceUrls.MEDIA_UPLOAD,
                this.authData.accessToken,
                this.authData.accessTokenSecret,
                params,
                "multipart/form-data",
                (error, data, results) => {
                    const response = JSON.parse(data)
                    const hasError = extractError(response)
                    return hasError
                        ? reject(hasError.message)
                        : resolve(response)
                }
            )
        })
    }
}

export default Media
