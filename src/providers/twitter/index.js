import express from 'express'
import linkedinAuthRouter from 'linkedin/api/auth'


const router = express.Router()


router.use('/auth', linkedinAuthRouter)


export default router