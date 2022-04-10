import express from 'express'
import Auth from 'twitter/services/auth'


const auth = new Auth();
const router = express.Router()


export default router