import jwt from 'jsonwebtoken'
import db from '../config/connectiondb.js'

export const checkAuthentication = function (req, res, next) {
    //console.log(req.body, req.cookies)
    const authKey = req.cookies.USERAUTHID
    if (authKey === undefined) {
        req.checkAuth = {
            isAuth: false,
            user_type: 'none',
            department:'none',
            employee_id: 'none',
            email:'none'
        }
        next()
    }
    else {
        const verifyKey = jwt.verify(req.cookies.USERAUTHID, process.env.JWT_SECRET)
        //console.log('coming', verifyKey)
        const { employee_id, email, user_type, department } = verifyKey
        req.checkAuth = {
            isAuth: true,
            user_type: user_type,
            department:department,
            employee_id: employee_id,
            email:email
        }
        next()
        // const q = `select * from usermanagement where employee_id=? and email=? and user_type=? and department=? and status='active'`
        // db.query(q, [employee_id, email, user_type, department], (err, result) => {
        //     if (err) {
        //         ////console.log(err)
        //         //req.isAuth = false
        //         req.checkAuth = {
        //             isAuth: false,
        //             user_type: user_type,
        //             department:department,
        //             employee_id: employee_id,
        //             email:email
        //         }
        //         next()
        //     }
        //     else {
        //         if (result.length === 0) {
        //             req.checkAuth = {
        //                 isAuth: false,
        //                 user_type: user_type,
        //                 department:department,
        //                 employee_id: employee_id,
        //                 email:email
        //             }
        //         }
        //         else {
        //             req.checkAuth = {
        //                 isAuth: true,
        //                 user_type: user_type,
        //                 department:department,
        //                 employee_id: employee_id,
        //                 email:email
        //             }
        //         }
        //         next()
        //     }
        // })
    }

    

}