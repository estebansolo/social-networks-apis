import express from 'express'
import Api from 'twitter/services/api'


const api = new Api();
const router = express.Router()


export default router