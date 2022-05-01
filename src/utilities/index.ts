export const extractError = (response: any) => {
    const { error, errors = [] } = response || {}

    if (error) {
        return error
    }

    if (errors.length > 0) {
        return errors[0]
    }
}

export const splitBuffer = (buffer: any, chunkSize: number) => {
    const chunks = Math.ceil(buffer.length / chunkSize)

    return new Array(chunks).fill(null).map((_, index) => {
        const start = index * chunkSize
        const end = index === chunks - 1 ? undefined : (index + 1) * chunkSize
        return buffer.slice(start, end)
    })
}