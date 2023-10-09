import expres from 'express'
import { addcompany,viewcompany,editcompany,deletecompany } from '../controllers/companymanagement.js'

const route = expres.Router()

route.post('/addcompany',addcompany)
route.get('/viewcompanys',viewcompany)
route.put('/editcompany/:id',editcompany)
route.post('/deletecompany',deletecompany)



export default route