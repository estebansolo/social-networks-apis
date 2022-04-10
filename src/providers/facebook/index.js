import express from 'express'
import facebookAuthRouter from 'facebook/routes/auth'
import facebookApiRouter from 'facebook/routes/api'


const router = express.Router()


router.use('/auth', facebookAuthRouter)
router.use('/api', facebookApiRouter)


export default router