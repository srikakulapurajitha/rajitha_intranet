import {  checkuserintrodetails, adduserintro } from "../controllers/userintrotour.js"
import express from 'express'
const route = express.Router()

route.post('/checkuserintrodetails',checkuserintrodetails)
route.post('/adduserintro',adduserintro)
export default route ;