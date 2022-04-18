export const parseFriends = (data, provider) => {
    const friendsData = {
        count: null,
        following: null,
        followers: null
    }

    switch (provider) {
        case "TWITTER":
            friendsData.followers = data.public_metrics.followers_count
            friendsData.following = data.public_metrics.following_count
            break

        case "FACEBOOK":
            friendsData.count = data.summary.total_count
            break

        case "LINKEDIN":
            friendsData.count = data.firstDegreeSize
            break
    }

    return friendsData
}

export const parsePostMetrics = (data, provider) => {
    const metricsData = {
        id: null,
        url: null,
        likes: 0,
        shares: 0,
        comments: 0,
        reactions: {},
        extra: {}
    }

    switch (provider) {
        case "TWITTER":
            metricsData.id = data.id
            metricsData.url = `https://twitter.com/${data.author_id}/status/${data.id}`
            metricsData.likes = data.public_metrics.like_count
            metricsData.shares = data.public_metrics.retweet_count
            metricsData.comments = data.public_metrics.reply_count
            // Extra Information
            metricsData.extra.organic_metrics = data.organic_metrics
            metricsData.extra.non_public_metrics = data.non_public_metrics
            break

        case "FACEBOOK":
            metricsData.id = data.id
            metricsData.url = data.permalink_url
            metricsData.shares = data.shares ? data.shares.count : 0
            metricsData.comments = data.comments.summary.total_count

            for (const reaction in data.reactions) {
                metricsData.likes += data.reactions[reaction].total || 0
                metricsData.reactions[data.reactions[reaction].reaction] =
                    data.reactions[reaction].total || 0
            }
            break

        case "LINKEDIN":
            metricsData.id = data.entity
            metricsData.comments = data.commentSummary.count
            metricsData.url = `https://www.linkedin.com/feed/update/${data.entity}`

            for (const reaction in data.reactionSummaries) {
                metricsData.likes += data.reactionSummaries[reaction].count
                metricsData.reactions[reaction] =
                    data.reactionSummaries[reaction].count || 0
            }
            break
    }

    return metricsData
}
