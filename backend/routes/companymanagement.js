import expres from 'express'
import { addcompany,viewcompany,editcompany,deletecompany, uploadStorage } from '../controllers/companymanagement.js'

const route = expres.Router()

route.post('/addcompany', uploadStorage.single('file'), addcompany)
route.get('/viewcompanys',viewcompany)
route.put('/editcompany/:id',uploadStorage.single('file'),editcompany)
route.post('/deletecompany',deletecompany)



export default route