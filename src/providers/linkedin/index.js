import express from 'express'
import linkedinAuthRouter from 'linkedin/routes/auth'
import linkedinApiRouter from 'linkedin/routes/api'


const router = express.Router()


router.use('/auth', linkedinAuthRouter)
router.use('/api', linkedinApiRouter)


export default router