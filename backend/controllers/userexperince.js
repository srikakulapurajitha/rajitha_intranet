import db from "../config/connectiondb.js"
import { v4 as uuidv4 } from 'uuid';

const addnewuserexperience = (emp_id) => {
    return new Promise((resolve, reject) => {
        try {
            const extract_usercreation_experience_query = `select date_of_joining, designation from usermanagement where employee_id = ?`
            const extract_usercreation_experience_value = [emp_id]
            db.query(extract_usercreation_experience_query, extract_usercreation_experience_value, async (err, result) => {
                if (err) reject('error occured!')
                else {
                    if (result.length === 0) {
                        reject('No data available for given employee')
                    }
                    else {
                        const { date_of_joining, designation } = result[0]
                        const id = uuidv4()
                        const insert_first_experience_record_query = `insert into userexperience(promotion_id,emp_id,promotion_title, promotion_date, roles_and_responsibility) values(?)`
                        const insert_first_experience_record_values = [[id, emp_id, designation, date_of_joining, '']]
                        await db.promise().query(insert_first_experience_record_query, insert_first_experience_record_values)
                        const user_exp_query = `select * from userexperience where emp_id = ? order by promotion_date`
                        const user_exp_value = [emp_id]
                        db.query(user_exp_query, user_exp_value, async (err, result) => {
                            if (err) {
                                console.log(err)
                                reject('error occured!')
                            }
                            else {
                                resolve(result)
                            }
                        })

                    }
                }
            })

        }
        catch {
            reject('error occured!')
        }
    })
}

const updateuserdesigantion = (emp_id) => {
    return new Promise((resolve, reject) => {
        try {
            const user_exp_query = `select * from userexperience where emp_id = ? order by promotion_date desc limit 1`
            const user_exp_value = [emp_id]
            db.query(user_exp_query, user_exp_value, async (err, result) => {
                if (err) {
                    //console.log(err)
                    reject('error occured!')
                }
                else {
                    if (result.length !== 0) {
                        const {promotion_title} = result[0]
                        const update_designation_query = `update usermanagement set designation = ? where employee_id=?`
                        const update_designation_value = [promotion_title, emp_id]
                        const update_designation_employeedetails_query = `update employeedetails set designation = ? where emp_id=?`
                        await db.promise().query(update_designation_query, update_designation_value)
                        await db.promise().query(update_designation_employeedetails_query, update_designation_value)
                        
                    }
                    resolve('updated')
                }
            })
        }
        catch {
            reject('error occured!')
        }
    })
}

export const getuserexperience = (req, res) => {
    console.log(req.body)
    if (req.checkAuth.isAuth) {
        const { emp_id } = req.body
        const user_exp_query = `select * from userexperience where emp_id = ? order by promotion_date`
        const user_exp_value = [emp_id]
        db.query(user_exp_query, user_exp_value, async (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json('error occured!')
            }
            else {
                if (result.length === 0) {
                    try {
                        const addnewuserexperienceData = await addnewuserexperience(emp_id)
                        
                        //console.log(addnewuserexperienceData)
                        return res.status(200).json(addnewuserexperienceData)
                    }
                    catch (err) {
                        console.log(err)
                        return 'error occured!'

                    }
                }
                else {
                    console.log(result)
                    return res.status(200).json(result)
                }
            }
        })

    }
    else {
        return res.status(406).json(`Unauthorized! can't able to perform action`)
    }
    //res.send('ok')

}

export const addnewpromotion = (req, res) => {
    console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const { emp_id, promotion_title, promotion_date, roles_and_responsibility } = req.body
        const check_promotion_query = ` select * from userexperience where emp_id=? and promotion_date=?`
        const check_promotion_values = [emp_id, promotion_date]
        db.query(check_promotion_query, check_promotion_values, async (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                if (result.length === 0) {
                    try {
                        const id = uuidv4()
                        const insert_experience_record_query = `insert into userexperience(promotion_id,emp_id,promotion_title, promotion_date, roles_and_responsibility) values(?)`
                        const insert_experience_record_values = [[id, emp_id, promotion_title, promotion_date, roles_and_responsibility]]
                        await db.promise().query(insert_experience_record_query, insert_experience_record_values)
                        await updateuserdesigantion(emp_id)
                        return res.status(201).json('New Promotion Added Successfully')
                    }
                    catch {
                        return res.status(500).json('error occured!')
                    }


                }
                else {
                    return res.status(401).json('Date for promotion already exists')
                }
            }
        })
    }
    else {
        return res.status(406).json(`Unauthorized! can't able to perform action`)
    }
    //res.send('ok')
}

export const modifypromotion = (req, res) => {
    console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const { promotion_id, emp_id, promotion_title, promotion_date, roles_and_responsibility } = req.body
        const check_promotion_query = ` select * from userexperience where emp_id=? and promotion_date=? and promotion_id!=?`
        const check_promotion_values = [emp_id, promotion_date, promotion_id]
        db.query(check_promotion_query, check_promotion_values, async (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                if (result.length === 0) {
                    try {

                        const modify_experience_record_query = `update userexperience set promotion_title = ?, promotion_date = date(?), roles_and_responsibility=? where emp_id=? and promotion_id=?;`
                        const modify_experience_record_values = [promotion_title, promotion_date, roles_and_responsibility, emp_id, promotion_id]
                        await db.promise().query(modify_experience_record_query, modify_experience_record_values)
                        await updateuserdesigantion(emp_id)
                        return res.status(201).json('Promotion Modified Successfully')
                    }
                    catch {
                        return res.status(500).json('error occured!')
                    }


                }
                else {
                    return res.status(401).json('Date for promotion already exists')
                }
            }
        })
    }
    else {
        return res.status(406).json(`Unauthorized! can't able to perform action`)
    }
    //res.send('ok')
}

export const deletepromotion = async (req, res) => {
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const { emp_id, promotion_id } = req.body
        try {

            const delete_experience_record_query = `delete from userexperience where emp_id=? and promotion_id=?;`
            const delete_experience_record_values = [emp_id, promotion_id]
            await db.promise().query(delete_experience_record_query, delete_experience_record_values)
            await updateuserdesigantion(emp_id)
            return res.status(201).json('Promotion Deleted Successfully')
        }
        catch {
            return res.status(500).json('error occured!')
        }
    }
    else {
        return res.status(406).json(`Unauthorized! can't able to perform action`)
    }
}