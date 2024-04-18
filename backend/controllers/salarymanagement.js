import db from "../config/connectiondb.js";
import CryptoJS from"crypto-js"

export const uploadsalarydata = (req, res) => {
    //console.log(req.body)
    if (req.checkAuth.isAuth) {
        const { year, month, type, excelData } = req.body
        const check_salary_data_query = `select * from salarymanagement where uploaded_year =? and uploaded_month=?`
        const check_salary_data_values = [year, month]
        db.query(check_salary_data_query, check_salary_data_values, async (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                try {
                    const insert_salary_data_query = `insert into salarymanagement values(?)`
                    if (type === 're-upload') {
                        const delete_salary_data_query = `delete from salarymanagement where uploaded_year =? and uploaded_month=?`
                        const delete_salary_data_values = [year, month]
                        await db.promise().query(delete_salary_data_query, delete_salary_data_values)
                        for (let i = 0; i < excelData.length; i++) {
                            const data = excelData[i]
                            if (data.empid === undefined || data.MONTH === undefined || data[`EMPLOYEE NAME`] === undefined || data.empsalorgbasic === undefined || data.empsalorghra === undefined || data.empsalorgconv === undefined || data.empsalorgedu === undefined || data.empsalorgshift === undefined || data.empsaltravel === undefined || data.empsalmedical === undefined || data.empsalorgsundrycreditothers === undefined || data.emporggross === undefined || data.empsalorgepf === undefined || data.empsalorgesi === undefined || data.empsalorgpt === undefined || data.A0 === undefined || data.B0 === undefined || data.empsalbasic === undefined || data.empsalhra === undefined || data.empsalconv === undefined || data.empsaledu === undefined || data.empsalshift === undefined || data['T/H'] === undefined || data.empsalmed === undefined || data.empsallta === undefined || data.empsalsundrycreditothers === undefined || data.empsallaptop === undefined || data.empsalinternet === undefined || data.empsalclientincentive === undefined || data.empsalincentive === undefined || data.empsalbonus === undefined || data.empsalawards === undefined || data.empsalothers === undefined || data.empsalgross === undefined || data.empsalepf === undefined || data.empsalesi === undefined || data.empsalpt === undefined || data.empsalitax === undefined || data.empsalsodexo === undefined || data.empsaldebitother === undefined || data.empsaldeductions === undefined || data.empsalnet === undefined) {
                                return res.status(406).json(`Choosen file not containing proper data!`)
                            }
                            else {
                                const insert_salary_data_value = [year, month, data.empid.replace(/[^0-9]/g, ""), data.MONTH, data[`EMPLOYEE NAME`], data.empsalorgbasic, data.empsalorghra, data.empsalorgconv, data.empsalorgedu, data.empsalorgshift, data.empsaltravel, data.empsalmedical, data.empsalorgsundrycreditothers, data.emporggross, data.empsalorgepf, data.empsalorgesi, data.empsalorgpt, data.A0, data.B0, data.empsalbasic, data.empsalhra, data.empsalconv, data.empsaledu, data.empsalshift, data['T/H'], data.empsalmed, data.empsallta, data.empsalsundrycreditothers, data.empsallaptop, data.empsalinternet, data.empsalclientincentive, data.empsalincentive, data.empsalbonus, data.empsalawards, data.empsalothers, data.empsalgross, data.empsalepf, data.empsalesi, data.empsalpt, data.empsalitax, data.empsalsodexo, data.empsaldebitother, data.empsaldeductions, data.empsalnet]
                                await db.promise().query(insert_salary_data_query, [insert_salary_data_value])
                            }
                        }
                        return res.status(201).json('Record Added Successfully')
                    }
                    else {
                        if (result.length === 0) {
                            for (let i = 0; i < excelData.length; i++) {
                                const data = excelData[i]
                                //console.log(data.empid===undefined || data.MONTH===undefined || data[`EMPLOYEE NAME`]===undefined || data.empsalorgbasic===undefined || data.empsalorghra===undefined || data.empsalorgconv===undefined || data.empsalorgedu===undefined || data.empsalorgshift===undefined || data.empsaltravel===undefined || data.empsalmedical===undefined || data.empsalorgsundrycreditothers===undefined || data.emporggross===undefined || data.empsalorgepf===undefined || data.empsalorgesi===undefined || data.empsalorgpt===undefined || data.A0===undefined || data.B0===undefined || data.empsalbasic===undefined || data.empsalhra===undefined || data.empsalconv===undefined || data.empsaledu===undefined || data.empsalshift===undefined || data['T/H']===undefined || data.empsalmed===undefined || data.empsallta===undefined || data.empsalsundrycreditothers===undefined || data.empsallaptop===undefined || data.empsalinternet===undefined || data.empsalclientincentive===undefined || data.empsalincentive===undefined || data.empsalbonus===undefined || data.empsalawards===undefined || data.empsalothers===undefined || data.empsalgross===undefined || data.empsalepf===undefined || data.empsalesi===undefined || data.empsalpt===undefined || data.empsalitax===undefined || data.empsalsodexo===undefined || data.empsaldebitother===undefined || data.empsaldeductions===undefined || data.empsalnet===undefined)
                                if (data.empid === undefined || data.MONTH === undefined || data[`EMPLOYEE NAME`] === undefined || data.empsalorgbasic === undefined || data.empsalorghra === undefined || data.empsalorgconv === undefined || data.empsalorgedu === undefined || data.empsalorgshift === undefined || data.empsaltravel === undefined || data.empsalmedical === undefined || data.empsalorgsundrycreditothers === undefined || data.emporggross === undefined || data.empsalorgepf === undefined || data.empsalorgesi === undefined || data.empsalorgpt === undefined || data.A0 === undefined || data.B0 === undefined || data.empsalbasic === undefined || data.empsalhra === undefined || data.empsalconv === undefined || data.empsaledu === undefined || data.empsalshift === undefined || data['T/H'] === undefined || data.empsalmed === undefined || data.empsallta === undefined || data.empsalsundrycreditothers === undefined || data.empsallaptop === undefined || data.empsalinternet === undefined || data.empsalclientincentive === undefined || data.empsalincentive === undefined || data.empsalbonus === undefined || data.empsalawards === undefined || data.empsalothers === undefined || data.empsalgross === undefined || data.empsalepf === undefined || data.empsalesi === undefined || data.empsalpt === undefined || data.empsalitax === undefined || data.empsalsodexo === undefined || data.empsaldebitother === undefined || data.empsaldeductions === undefined || data.empsalnet === undefined) {
                                    return res.status(406).json(`Choosen file not containing proper data!`)
                                }
                                else {
                                    const insert_salary_data_value = [year, month, data.empid.replace(/[^0-9]/g, ""), data.MONTH, data[`EMPLOYEE NAME`], data.empsalorgbasic, data.empsalorghra, data.empsalorgconv, data.empsalorgedu, data.empsalorgshift, data.empsaltravel, data.empsalmedical, data.empsalorgsundrycreditothers, data.emporggross, data.empsalorgepf, data.empsalorgesi, data.empsalorgpt, data.A0, data.B0, data.empsalbasic, data.empsalhra, data.empsalconv, data.empsaledu, data.empsalshift, data['T/H'], data.empsalmed, data.empsallta, data.empsalsundrycreditothers, data.empsallaptop, data.empsalinternet, data.empsalclientincentive, data.empsalincentive, data.empsalbonus, data.empsalawards, data.empsalothers, data.empsalgross, data.empsalepf, data.empsalesi, data.empsalpt, data.empsalitax, data.empsalsodexo, data.empsaldebitother, data.empsaldeductions, data.empsalnet]
                                    await db.promise().query(insert_salary_data_query, [insert_salary_data_value])
                                }
                            }
                            return res.status(201).json('Record Added Successfully')

                        }
                        else {
                            return res.status(406).json(`Salary data alreday exists for month:${month} and year:${year}`)
                        }
                    }
                }
                catch (err) {
                    console.log(err)
                    if (err.errno == 1048) {
                        return res.status(406).json(`Choosen file not containing proper data!`)
                    }
                    else {
                        return res.status(500).json('error occured!')
                    }
                }

            }
        })

    }
    else {
        return res.status(401).json(`Unauthorized User can't perform action!`)
    }

}

export const viewsalarydata = (req, res) => {
    if (req.checkAuth.isAuth) {
        const { year, month } = req.body
        const check_salary_data_query = `select * from salarymanagement where uploaded_year =? and uploaded_month=? order by empid`
        const check_salary_data_values = [year, month]
        db.query(check_salary_data_query, check_salary_data_values, async (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                const data = CryptoJS.AES.encrypt(JSON.stringify(result),process.env.DATA_ENCRYPTION_SECRETE).toString()
                return res.status(200).json(data)
            }
        })


    }
    else {
        return res.status(401).json(`Unauthorized User can't perform action!`)
    }

}

export const viewusermonthsalarydata = (req, res) => {
    if (req.checkAuth.isAuth) {
        const { year, month, emp_id } = req.body
        const check_salary_data_query = `select * from salarymanagement where uploaded_year =? and uploaded_month=? and empid=? order by empid`
        const check_salary_data_values = [year, month, emp_id]
        db.query(check_salary_data_query, check_salary_data_values, async (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                console.log('res', result)
                return res.status(200).json(result)
            }
        })


    }
    else {
        return res.status(401).json(`Unauthorized User can't perform action!`)
    }

}

export const lastsalarythreerecoreds = (req, res) => {
    if (req.checkAuth.isAuth) {
        //console.log(req.body)
        const { emp_id } = req.body
        const months = {
            1: 'January',
            2: 'February',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December'
        }
        const startDate = new Date();
        let count = 1
        const searchData = []
        while (count <= 3) {
            const prevDate = new Date(startDate.getFullYear(), startDate.getMonth() - count)
            searchData.push(prevDate.getFullYear(), months[prevDate.getMonth() + 1])
            //console.log(new Date(startDate.getFullYear(), startDate.getMonth() - count))
            count = count + 1
        }
        //console.log(searchData)

        const check_salary_data_query = `select uploaded_month,empsalnet,empsalepf from salarymanagement where empid=? and ((uploaded_year =? and uploaded_month=?) or (uploaded_year =? and uploaded_month=?) or (uploaded_year =? and uploaded_month=?)) `
        const check_salary_data_values = [emp_id, ...searchData]
        db.query(check_salary_data_query, check_salary_data_values, async (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                const data = searchData.filter((_, i) => i % 2).map(m => result.filter(res => res.uploaded_month === m)[0] === undefined ? { uploaded_month: m, empsalnet: 'None', empsalepf: 'None' } : result.filter(res => res.uploaded_month === m)[0])
                //console.log('res', data)
                return res.status(200).json(data)
            }
        })
    }
    else {
        return res.status(401).json(`Unauthorized User can't perform action!`)
    }
}


export const companydetails = (req, res) => {
    if (req.checkAuth.isAuth) {
        const { emp_id } = req.body
        const get_company_data_query = `select company_logo, company_address from companymanagement inner join usermanagement on companymanagement.company_name = usermanagement.company_name where employee_id = ?`
        const get_company_data_values = [emp_id]
        db.query(get_company_data_query, get_company_data_values, (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                return res.status(200).json(result)
            }
        })
    }
    else {
        return res.status(401).json(`Unauthorized User can't perform action!`)
    }


}

export const deletesalartdetails = async (req, res) => {
    if (req.checkAuth.isAuth) {
        const {year, month} = req.body
        const delete_salary_data_query = `delete from salarymanagement where uploaded_year =? and uploaded_month=?`
        const delete_salary_data_values = [year, month]
        try{
            await db.promise().query(delete_salary_data_query, delete_salary_data_values)
            return res.status(200).json('Record Deleted Successfully')
        }
        catch{
            return res.status(500).json('error occured!')
        }
       
    }
    else {
        return res.status(401).json(`Unauthorized User can't perform action!`)
    }
}

