import db from "../config/connectiondb.js";

const months = { 0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December' }

export const monthattendance = (req, res) => {
    console.log(req.body)
    let { emp_id, from_date, to_date } = req.body

    console.log(from_date, to_date)
    const q = `select * from attendance where pdate>=date(?) and pdate<=date(?) and emp_id=? order by pdate`
    const v = [from_date, to_date, emp_id]
    db.query(q, v, (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            //console.log(result)
            return res.status(200).json(result)
        }
    })
    //res.send('ok')
}



export const monthbalance = (req, res) => {
    console.log(req.body)
    const { emp_id, from_date, to_date } = req.body

    console.log(from_date, to_date)
    const q = `select * from balanceleaves where date>=date(?) and date<=date(?) and emp_id=? order by id`
    const v = [from_date, to_date, emp_id]
    db.query(q, v, (err, balanceData) => {
        if (err) return res.status(500).json('error occured!')
        else {
            //console.log(result)
            if (balanceData.length !== 0) {
                const open_leaves = balanceData[0].total_leaves + balanceData[0].credit + balanceData[0].debit
                const balance_leaves = balanceData[balanceData.length - 1].total_leaves
                //const new_added_leaves = balanceData.filter(leaves=>leaves.reference==='annual leaves' || leaves.reference==='admin adjustment').map(leave=>leave.credit).reduce((accumulator, currentValue)=>accumulator + currentValue,0)
                const new_added_leaves = balanceData.map(leave => leave.credit).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                const adjusted_leaves = balanceData.map(leave => leave.debit).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                console.log('open_leaves:', open_leaves)
                console.log('balance_leaves:', balance_leaves)
                console.log('new_added_leaves:', new_added_leaves)
                console.log('adjusted_leaves:', adjusted_leaves)
                return res.status(200).json({ open_leaves: open_leaves, balance_leaves: balance_leaves, new_added_leaves: new_added_leaves, adjusted_leaves: adjusted_leaves })
            }
            else {
                const q = `select total_leaves from balanceleaves where date<? and emp_id=? order by id  limit 1 `

                const v = [from_date, emp_id]
                db.query(q, v, (err, result) => {
                    if (err) return res.status(500).json('error occured!')
                    else {
                        console.log('balence', result)
                        if (result.length == 0) {
                            return res.status(200).json({ open_leaves: 0, balance_leaves: 0, new_added_leaves: 0, adjusted_leaves: 0 })
                        }
                        else {
                            return res.status(200).json({ open_leaves: result[0].total_leaves, balance_leaves: result[0].total_leaves, new_added_leaves: 0, adjusted_leaves: 0 })
                        }
                    }
                })
            }


        }
    })
    //res.send('ok')
}


//-------------------------------------manage leaves-------------------------------------

export const getemployeedata = (req, res) => {
    console.log(req.checkAuth)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const userQuery = `select concat(first_name,' ',last_name) as fullname,employee_id, status, user_type, department, date_of_joining from usermanagement where status='active' ; `
        db.query(userQuery, (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                console.log(result)
                const data = result.map(res => ({ value: res, label: `${res.fullname} (bcg/${res.employee_id})` }))
                return res.send(data)
            }
        })

    }
    else {
        console.log('Unauthorized User!')
        return res.status(401).json('Unauthorized User!')

    }


}

export const manageleaves = async (req, res) => {
    console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const { emp_id, manageType, no_of_leaves, date, reference, totalLeaves } = req.body
        const update_balace_leaves_quary = `insert into balanceleaves(emp_id,${manageType},date,total_leaves,reference) values(?)`
        const update_balace_leaves_values = [[emp_id, no_of_leaves, date, totalLeaves, reference]]
        try {
            await db.promise().query(update_balace_leaves_quary, update_balace_leaves_values)
            return res.status(200).json('Record added succefully')
        }
        catch (err) {
            console.log(err)
            return res.status(500).json('Error occured! Record not added! ')
        }

    }
    else {
        console.log('Unauthorized User!')
        return res.status(401).json('Unauthorized User!')

    }
    //res.send('ok')
}


export const managedepartmentsleaves = (req, res) => {
    console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const { company_name, manage_type, departments, no_of_leaves, date, reference, auto, carrie_forward_leaves } = req.body
        const find_employees_query = `select employee_id,(select total_leaves from balanceleaves where emp_id=employee_id order by id desc limit 1) as total_leaves from usermanagement where company_name=? and status='active' and department in (?);`
        const find_employees_values = [company_name, departments]
        db.query(find_employees_query, find_employees_values, async (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json('Error occured! Record not added! ')

            }
            else {

                const employees = result.map(data => ({ ...data, total_leaves: data.total_leaves === null ? 0 : data.total_leaves }))
                console.log(employees)
                for (let i = 0; i < employees.length; i++) {
                    const { employee_id, total_leaves } = employees[i]
                    let totalBal = 0
                    if (auto && manage_type === 'credit') {
                        if (total_leaves <= carrie_forward_leaves) {
                            totalBal = total_leaves + no_of_leaves
                        }
                        else {
                            totalBal = carrie_forward_leaves + no_of_leaves
                        }
                    }
                    else if (!auto && manage_type === 'credit') {
                        totalBal = total_leaves + no_of_leaves

                    }
                    else if (!auto && manage_type === 'debit') {
                        totalBal = total_leaves - no_of_leaves
                    }
                    const insert_balance_record_query = `insert into balanceleaves(emp_id,${manage_type},date,total_leaves,reference) values(?)`
                    const insert_balance_record_values = [[employee_id, no_of_leaves, date, totalBal, reference]]
                    try {
                        await db.promise().query(insert_balance_record_query, insert_balance_record_values)

                    }
                    catch {
                        return res.status(500).json('Error occured! Record not added! ')

                    }
                }
                return res.status(201).json('Record added successfully')
            }

        })
    }
    else {
        return res.status(401).json(`Unauthorized User can't perform action!`)
    }


    //res.send('ok')


}


export const generateattendance = (req, res) => {
    console.log(req.body)

    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        let { month, year, fiveDaysWorkingDays, sixDaysWorkingDays } = req.body
        month = Number(month)
        year = Number(year)
        fiveDaysWorkingDays = Number(fiveDaysWorkingDays)
        sixDaysWorkingDays = Number(sixDaysWorkingDays)
        //console.log('data', month, year, fiveDaysWorkingDays, sixDaysWorkingDays )
        
        //month, year, fiveDaysWorkingDays, sixDaysWorkingDays= , ,Number(fiveDaysWorkingDays),Number(sixDaysWorkingDays)
        

        const find_record_query = 'select * from monthattendance where year=? and month=? limit 1'
        const find_record_values = [year, months[month]]
        db.query(find_record_query, find_record_values, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json('error occured!')
            }
            else {
                if (result.length === 0) {
                    const find_working_employees_query = `select employee_id, concat(first_name,' ',last_name) as name, shift from usermanagement where status = 'active' order by employee_id`
                    db.query(find_working_employees_query, async (dberror, dbresult) => {
                        if (dberror) {
                            console.log(dberror)
                            return res.status(500).json('error occured!')
                        }
                        else {
                            //console.log(dbresult)
                            try {
                                const monthTotalDays = Math.round(Math.abs((new Date(year, month, 25) - new Date(year, month - 1, 26)) / (24 * 60 * 60 * 1000))) + 1 // diff between days +1(considering beacuse count starting from 26-26)
                                console.log('totaldays:', monthTotalDays)
                                //let x = dbresult.filter(data => data.employee_id == 1250)

                                const startDate = new Date(year, month - 1, 26).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).slice(0, 10).split('/').reverse().join('-')
                                const endDate = new Date(year, month, 25).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).slice(0, 10).split('/').reverse().join('-')

                                const check_attendance_query = `select * from attendance where pdate in (?)`
                                const check_attendance_values = [[startDate,endDate]]

                                let attendance_result = await db.promise().query(check_attendance_query, check_attendance_values)
                                attendance_result = attendance_result[0]

                                if (attendance_result.length >= dbresult.length*2) {
                                    const workingDays = {
                                        9: fiveDaysWorkingDays,
                                        8: sixDaysWorkingDays

                                    }

                                    for (let i of dbresult) {
                                        //console.log(i)

                                        //console.log(startDate, endDate)
                                        const q = `select * from attendance where pdate>=date(?) and pdate<=date(?) and emp_id=? order by pdate`
                                        const v = [startDate, endDate, i.employee_id]


                                        try {
                                            const res = await db.promise().query(q, v)
                                            const result = res[0]
                                            if (result.length === monthTotalDays) {
                                                const present_days = result.filter(data => data.updated_status == 'XX').length
                                                const absent_days = result.filter(data => data.updated_status == 'AA').length
                                                const not_compensated_days = result.filter(data => data.updated_status == 'XA').length
                                                const half_days_leaves = result.filter(data => data.updated_status == 'XL').length
                                                const full_days_leaves = result.filter(data => data.updated_status == 'EL').length
                                                const holidays = result.filter(data => data.updated_status == 'HH').length

                                                const totalWorkingDays = workingDays[i.shift]
                                                //console.log('workingDays', totalWorkingDays,i.shift,workingDays[i.shift],workingDays)
                                                const totalPresentDays = present_days + holidays + (half_days_leaves/2)
                                                const totalApprovedLeaves = (half_days_leaves/2) + full_days_leaves
                                                const totalUnapprovedLeaves = absent_days + not_compensated_days

                                                
                                                const finding_leaves_query = `select * from balanceleaves where date >=? and date <=? and emp_id=? order by date`
                                                const finding_employees_values = [startDate, endDate, i.employee_id]
                                                
                                                const last_total_balacance_query = `select total_leaves from balanceleaves where emp_id=? order by id desc limit 1`
                                                const last_total_balacance_values = [ i.employee_id]



                                                const find_employees_result = await db.promise().query(finding_leaves_query, finding_employees_values)
                                                const balanceLeaves = find_employees_result[0]

                                                const  last_total_balacance_result = await db.promise().query(last_total_balacance_query, last_total_balacance_values)
                                                const totalBal = (last_total_balacance_result[0]).length===0?0:(last_total_balacance_result[0][0])['total_leaves']
                                                console.log('balance', find_employees_result[0], totalBal)



                                                const bal = balanceLeaves[0]
                                                
                                                const openLeaves = balanceLeaves.length === 0 ? totalBal : bal['total_leaves']+bal['debit']-bal['credit']
                                                const newLeavesAdded = balanceLeaves.length === 0 ? 0 : balanceLeaves.map(data => data.credit).reduce((prev, curr) => prev + curr)
                                                const adjustedLeaves = totalApprovedLeaves + totalUnapprovedLeaves
                                                let lossOfPays;
                                                // if (totalBal === undefined) {
                                                //     if (0 - totalUnapprovedLeaves < 0) {
                                                //         lossOfPays = adjustedLeaves

                                                //     }
                                                //     else {
                                                //         lossOfPays = 0
                                                //     }
                                                // }
                                                //else {
                                                    if (totalBal - totalUnapprovedLeaves < 0) {
                                                        lossOfPays = adjustedLeaves

                                                    }
                                                    else {
                                                        lossOfPays = 0
                                                    }
                                                //}

                                                //const lossOfPays = balanceLeaves.length===0?0-totalUnapprovedLeaves <0?adjustedLeaves:0:(balanceLeaves[balanceLeaves.length-1])['total_leaves']-totalUnapprovedLeaves<0?adjustedLeaves:0 //balanceLeaves.length===0?(0-totalApprovedLeaves< 0 ? adjustedLeaves : 0):((balanceLeaves[balanceLeaves.length - 1])['total_leaves'] - totalUnapprovedLeaves) < 0 ? adjustedLeaves : 0
                                                const monthBalanceLeaves = balanceLeaves.length === undefined ? 0 - totalUnapprovedLeaves : openLeaves - (totalUnapprovedLeaves+totalApprovedLeaves)
                                                console.log('monthbal', monthBalanceLeaves, adjustedLeaves, lossOfPays)

                                                //deduction

                                                const unapproved_leaves_deduction_query = `insert into balanceleaves(emp_id, debit, date, total_leaves, reference) values(?)`
                                                const unapproved_leaves_deduction_values = [[i.employee_id, totalUnapprovedLeaves,new Date().toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).slice(0, 10).split('/').reverse().join('-') , totalBal-totalUnapprovedLeaves, `${months[month]},${year} Unapproved-Leaves Deduction`]]

                                                if (totalUnapprovedLeaves !== 0) {
                                                    await db.promise().query(unapproved_leaves_deduction_query, unapproved_leaves_deduction_values)
                                                }

                                                //month attendance record insertion

                                                const month_record_insert_query = `insert into monthattendance values(?)`
                                                const month_record_insert_values = [[year, months[month], i.employee_id, i.name, totalWorkingDays, totalPresentDays, totalUnapprovedLeaves, totalApprovedLeaves, totalUnapprovedLeaves, openLeaves, newLeavesAdded, adjustedLeaves, lossOfPays, monthBalanceLeaves]]

                                                await db.promise().query(month_record_insert_query, month_record_insert_values)


                                            }
                                            else{
                                                //console.log(fiveDaysWorkingDays)
                                            }

                                        }
                                        catch (err) {
                                            console.log(err)
                                            return res.status(500).json('error occured!')

                                        }


                                    }

                                    return res.status(200).json('Month Record Generated Shortly...')

                                }
                                else {
                                    return res.status(406).json('Please upload all employees attendance data till 26th of last month to 25th of selected month!')
                                }

                            }
                            catch (err) {
                                console.log(err)
                                return res.status(500).json('error occured!')

                            }


                        }
                    })

                }
                else {
                    return res.status(406).json('Record already exists!')
                }
            }

        })





        //res.send('ok')
    }
    else {
        return res.status(401).json(`Unauthorized User can't perform action!`)
    }
}


export const viewgeneratedattendance = (req,res)=>{
    //console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const {month, year} = req.body
        const check_generated_attendace_query = `select * from monthattendance where month=? and year=? order by emp_id`
        const check_generated_attendace_values = [month,year]

        db.query(check_generated_attendace_query, check_generated_attendace_values, (err,result)=>{
            if (err) return res.status(500).json('error occured!')
            else{
                if(result.length===0){
                    return res.status(406).json('No record found!')
                }
                else{
                    return res.status(200).json(result)
                }
            }
        })
    }
    else{
        return res.status(401).json(`Unauthorized User can't perform action!`) 
    }
    //


}


// export const deletegeneratedattendance = async(req,res) =>{
//     if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
//         const {month, year} = req.body
//         const keys  =  Object.keys(months)
//         const values = Object.values(months)
//         //console.log(values.indexOf(month),keys[values.indexOf(month)])
//         //const date = new Date(year, keys[values.indexOf(month)],25).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).slice(0, 10).split('/').reverse().join('-')
//         //console.log(date)
//         const delete_generated_attendace_query = `delete from monthattendance where month=? and year=? `
//         const delete_generated_attendace_values = [month,year]
//         const delete_balanced_leaves_entries_query = `delete from balanceleaves where reference=?`

//         const delete_balanced_leaves_entries_values = [ `${month},${year} Unapproved-Leaves Deduction`]
//         try{
            
//             await db.promise().query(delete_generated_attendace_query, delete_generated_attendace_values)
//             await db.promise().query(delete_balanced_leaves_entries_query, delete_balanced_leaves_entries_values)

//             return res.status(200).json('Generated Attendance Deleted Successfully')

//         }
//         catch(err){
//             console.log(err)
//             return res.status(500).json('error occured!')
//         }
         
//     }
//     else{
//         return res.status(401).json(`Unauthorized User can't perform action!`) 
//     }
// }

export const generatedmonthattendance = async(req,res)=>{
    if (req.checkAuth.isAuth) {
        const {month, year,emp_id} = req.body
        const startDate = new Date(year, month - 1, 26).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).slice(0, 10).split('/').reverse().join('-')
        const endDate = new Date(year, month, 25).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).slice(0, 10).split('/').reverse().join('-')

        const check_generated_attendace_query = `select working_days, present_days, approved_leaves, unapproved_leaves, open_leaves, new_leaves_added, adjusted_leaves, lop, balance_leaves from monthattendance where month=? and year=? and emp_id =?`
        const check_generated_attendace_values = [months[month],year,emp_id]

        const month_attendance_query = `select * from attendance where pdate>=date(?) and pdate<=date(?) and emp_id=? order by pdate`
        const month_attendance_values = [startDate,endDate,emp_id]

        try{
            const generateattendanceResult = await db.promise().query(check_generated_attendace_query, check_generated_attendace_values)
            const monthAttendanceResult = await db.promise().query(month_attendance_query, month_attendance_values)
            return res.send({attendance:monthAttendanceResult[0], genereatedAttendance: generateattendanceResult[0]})


        }
        catch(err){
            console.log(err)
            return res.status(500).json('error occured!')

        }

    }
    else{
        return res.status(401).json(`Unauthorized User can't perform action!`) 
    }

}