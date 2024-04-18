import db from "../config/connectiondb.js";

export const adduserintro = (req, res) => {
    const {employee_id} = req.body
    const q = `insert into intro(emp_id) values(?);`
    const v = [[employee_id]]
    db.query(q, v,(err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            return res.status(200).json(result)
        }
    })
}

export const checkuserintrodetails = (req, res) => {
    console.log(req.body)
    const {employee_id} = req.body
    const q = `select emp_id from intro where emp_id =?`
    const v = [employee_id]
    db.query(q, v,(err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            if(result.length===0){
                return res.status(200).json(true)
            }
            else{
                return res.status(200).json(false)
            }
            //return res.status(200).json(result)
        }
    })
}