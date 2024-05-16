import expres from 'express'
import { companydetails, deletesalartdetails, employeedetails, lastsalarythreerecoreds, uploadsalarydata, viewsalarydata, viewusermonthsalarydata } from '../controllers/salarymanagement.js'



const route = expres.Router()


route.post('/uploadsalarydata',uploadsalarydata)
route.post('/viewsalarydata', viewsalarydata)
route.post('/viewusermonthsalarydata', viewusermonthsalarydata)
route.post('/lastsalarythreerecoreds',lastsalarythreerecoreds)
route.post('/deletesalartdetails',deletesalartdetails)

route.post('/companydetails', companydetails)
route.get('/employeedetails', employeedetails)


export default route