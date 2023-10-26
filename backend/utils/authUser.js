import db from "../config/connectiondb.js"

const IsAuthenticated = ( employee_id, email, access) => {
    return new Promise((resolve, reject) => {
        try {
            const q = `select * from usermanagement where employee_id=? and email=? and access=? and status='active'`
            db.query(q, [employee_id, email, access], (err, result) => {
                if (err) {
                    //console.log(err)
                    reject('error occured!')
                }
                else {
                    //console.log('isA', result.length)
                    if (result.length === 0) {

                        resolve('Unauthorized')
                    }
                    else {
                        //console.log('isA', result)
                        resolve('Authorized')
                    }
                }
            })
        }
        catch (err) {
            //console.log(err)
            resolve('Unauthorized')
        }

    })

}

export default IsAuthenticated