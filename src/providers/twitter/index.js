import express from 'express'
import twitterAuthRouter from 'twitter/routes/auth'
import twitterApiRouter from 'twitter/routes/api'


const router = express.Router()


router.use('/auth', twitterAuthRouter)
router.use('/api', twitterApiRouter)


export default router