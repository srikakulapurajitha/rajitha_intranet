import db from "../config/connectiondb.js"
import { v4 as uuidv4 } from 'uuid';
import { transporter } from "../config/emailconfig.js";
import 'dotenv/config'
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
import compensation from "../middleware/compensation.js";


const leaveTypes = {
    'Casual': 'CL',
    'Special': 'SL'
}

const months = { 0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December' }


export const getreportinghead = (req, res) => {
    const { emp_id } = req.body
    const q = `select concat(first_name,' ', last_name) as name, email from usermanagement inner join reportingstructure on employee_id = reporting_head where users=? `
    const v = [emp_id]
    db.query(q, v, (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            return res.status(200).json(result)
        }
    })

}

export const pendingleaves = (req, res) => {
    const { emp_id } = req.body
    const q = `select count(total_leaves) as pending_leaves from applyleaves where status='pending' and emp_id=?`
    const v = [emp_id]
    db.query(q, v, (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            return res.status(200).json(result)
        }
    })
}

export const applyforleave = (req, res) => {
    // console.log(req.body)
    let { reporting_head_name, mail_approved_by, balance_leaves, cc_mail, leave_type, leave_options, from_date, to_date, selected_dates, half_day, total_leaves, reason, applicant_emp_id, applicant_name, applicant_email } = req.body
    const applicationId = uuidv4()
    // console.log(cc_mail)
    const cc_mails = cc_mail.replace(/\n/g, '')
    const leave_dates = selected_dates.join(',')

    const check_application_query = `select * from applyleaves where (selected_dates rlike ? or half_day rlike ?) and emp_id=? and (status='approved' or status ='pending');`
    let check_application_values;
    if (selected_dates.length === 0) {
        check_application_values = [half_day, half_day, applicant_emp_id]
    }
    else if (half_day === '') {
        check_application_values = [selected_dates.join('|'), selected_dates.join('|'), applicant_emp_id]
    }
    else {
        check_application_values = [selected_dates.join('|'), half_day, applicant_emp_id]
    }

    db.query(check_application_query, check_application_values, async (checkerr, checkres) => {
        // console.log('check result', checkres)
        if (checkerr) {
            // console.log(checkerr)
            return res.status(500).json('error occured!')
        }

        else {
            if (checkres.length === 0) {
                const q = `insert into applyleaves(id,mail_approved_by, cc_mail, leave_type, leave_option, from_date, to_date, selected_dates, half_day, total_leaves, reason, status, emp_id, applicant_name, applicant_email) values(?)`
                const v = [[applicationId, mail_approved_by, cc_mails, leave_type, leave_options, from_date, to_date, leave_dates, half_day, total_leaves, reason, 'pending', applicant_emp_id, applicant_name, applicant_email]]
                try {
                    await db.promise().query(q, v)
                    const mailOptions = {
                        from: `"${applicant_name}" <${applicant_email}`,
                        to: [mail_approved_by],
                        cc: cc_mails.split(','),
                        subject: 'Apply For Leave',
                        template: 'LeaveRequest',
                        context: {
                            reporting_head: reporting_head_name,
                            applicant_name: applicant_name,
                            applicant_emp_id: applicant_emp_id,
                            total_leaves: total_leaves,
                            balence_leaves: balance_leaves,
                            reason: reason,
                            leave_type: leave_type,
                            leave_option: leave_options,
                            selected_dates: selected_dates !== '' ? selected_dates : 'NA',
                            half_day: half_day !== '' ? half_day : 'NA',
                            approve_request: `http://localhost:3000/reportingheadlogin/application/approve?id=${applicationId}`,
                            deny_request: `http://localhost:3000/reportingheadlogin/application/deny?id=${applicationId}`
                        }
                    }

                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            // console.log(err)
                            return res.status(500).json('Not able send mail!')
                        }
                        else return res.status(201).json('Mail sended to your corresponding reporting head for approvel')
                    })

                }
                catch (err) {
                    // console.log(err)
                    return res.status(500).json('error occured!')
                }
            }
            else {
                const selectedDates = [...selected_dates, half_day]
                const alreadyExistsDates = [...checkres[0].selected_dates.replace(/ /g, '').split(','), checkres[0].half_day]
                // console.log(selectedDates, alreadyExistsDates, checkres[0].selected_dates.replace('', ''))
                let existDates = selectedDates.filter(date => alreadyExistsDates.includes(date) && date !== '')

                return res.status(406).json(`Already applied for leave on ${existDates.join(', ')}`)

            }
        }

    })







    //res.send('ok')
}

export const reportingheadlogin = (req, res) => {
    // console.log(req.body)

    const { email, password, status, applicationId } = req.body

    //// console.log(req.body)
    //if(bcrypt.compareSync(req.body.password))
    const check_application_query = `select * from applyleaves where mail_approved_by=? and id=?`
    const check_application_values = [email, applicationId]
    db.query(check_application_query, check_application_values, (checkerr, checkres) => {
        if (checkerr) return res.status(500).json('error occured!')
        else {
            // console.log(checkres)
            if (checkres.length === 0) {
                return res.status(500).json('Invalid Application')
            }
            else {
                const q = `select * from usermanagement where email=? and status='active'`
                db.query(q, [req.body.email], async (err, result) => {
                    if (err) return res.status(500).json('error occured!')
                    else {
                        if (result.length !== 0 && bcrypt.compareSync(password, result[0].password)) {
                            let application_status;
                            switch (status) {
                                case 'approve':
                                    application_status = 'approved'
                                    break
                                case 'deny':
                                    application_status = 'denied'
                                    break
                                case 'cancel':
                                    application_status = 'cancelled'
                                    break
                                default:
                                    application_status = 'NA'
                                    break

                            }
                            const mail_templte = application_status === 'approved' ? 'LeaveRequestApproved' : application_status === 'denied' ? 'LeaveRequestDenied' : 'LeaveRequestCancelled'
                            // console.log(mail_templte)
                            result = result[0]
                            const token = jwt.sign({ employee_id: result.employee_id, email: result.email }, process.env.HEAD_JWT_SECRET)
                            // console.log(token)
                            //delete result.password
                            const { id, applicant_name, applicant_email, emp_id, from_date, to_date, leave_type, leave_option, selected_dates, half_day, total_leaves } = checkres[0]


                            // console.log('cancel application', 'coming', application_status,)
                            if ((checkres[0].status === 'pending' && (application_status === 'approved' || application_status === 'denied')) || (checkres[0].status === 'approved' && application_status === 'cancelled')) {


                                // const update_application_query = `update applyleaves set status=? where id=?`
                                // const update_application_values = [application_status, applicationId]


                                const mailOptions = {
                                    from: `"${result.first_name} ${result.last_name}" <${applicant_email}`,
                                    to: [applicant_email],
                                    subject: 'Your Request is ' + `${application_status}`.toUpperCase(),
                                    template: mail_templte,
                                    context: {
                                        to: `${applicant_name}(bcg/${emp_id})`,
                                        from_date: from_date !== '' ? from_date : 'NA',
                                        to_date: to_date !== '' ? to_date : 'NA',
                                        leave_type: leave_type,
                                        leave_option: leave_option,
                                        full_days: selected_dates !== '' ? selected_dates : 'NA',
                                        half_days: half_day !== '' ? half_day : 'NA',
                                        total_leaves: total_leaves,
                                        approved_by: `${result.first_name} ${result.last_name} (bcg/${result.employee_id})`,
                                        status: application_status
                                    }
                                }

                                const q = `select total_leaves from balanceleaves where emp_id=? order by id desc limit 1 `
                                const v = [emp_id]
                                db.query(q, v, async (err, result) => {
                                    if (err) return res.status(500).json('error occured!')
                                    else {
                                        // console.log('balence', result)

                                        let total = 0
                                        if (result.length !== 0) {
                                            total = result[0].total_leaves
                                        }

                                        const update_application_query = `update applyleaves set status=? where id=?`
                                        const update_application_values = [application_status, applicationId]
                                        let anyError;
                                        try {



                                           
                                            await db.promise().query(update_application_query, update_application_values)
                                            const dates = [...selected_dates.split(','), half_day].filter(date => date !== '')
                                            console.log('dates', dates)
                                            
                                            if (application_status === 'approved') {
                                                // console.log('approval')
                                                let total = 0
                                                if (result.length !== 0) {
                                                    total = result[0].total_leaves
                                                }
                                                let update_balance_query_params = []
            
                                                const update_balance_values = []
                                                //let total = result[0].total_leaves
            
            
                                                // dates.forEach(date => {
                                                //     // console.log(date)
                                                //     if (date !== '') {
                                                //         update_balance_query_params.push('(?)')
                                                //         if (dates[dates.length - 1] === date && half_day !== "") {
                                                //             total = total - 0.5
                                                //             update_balance_values.push([emp_id, 0, 0.5, date, total, id])
                                                //         }
                                                //         else {
                                                //             total = total - 1
                                                //             update_balance_values.push([emp_id, 0, 1, date, total, id])
                                                //         }
                                                //     }
            
                                                // })
            
                                                //const update_generated_attendance_for_days = []
                                                for(let x of dates){
                                                    const date = new Date(x)
                                                    let month, year;
                                                    if(date.getDate()<=25){
                                                        month = months[date.getMonth()]
                                                        year = date.getFullYear()
                                                    }
                                                    else{
                                                        const new_date = new Date(date.getFullYear(),date.getMonth()+1,1)
                                                        month = months[new_date.getMonth()]
                                                        year = new_date.getFullYear()
                                                    }
                                                    console.log('month/year:', month, year)
                                                    const check_generated_attendace_query = `select * from monthattendance where month = ? and year =? and emp_id=?`
                                                    const check_generated_attendace_values = [month,year,emp_id]
                                                    const check_generated_attendace_result = await db.promise().query(check_generated_attendace_query, check_generated_attendace_values)
                                                    const check_result = check_generated_attendace_result[0]
                                                    console.log('check_result',check_result.length)
                                                    if(check_result.length===0){
                                                        update_balance_query_params.push('(?)')
                                                        console.log('consider', x)
                                                        if (dates[dates.length - 1] === x && half_day !== "") {
                                                            total = total - 0.5
                                                            update_balance_values.push([emp_id, 0, 0.5, x, total, id])
                                                        }
                                                        else {
                                                            total = total - 1
                                                            update_balance_values.push([emp_id, 0, 1, x, total, id])
                                                        }
                                                    }
                                                    else{
                                                        console.log('wont consider', x)
                                                        //update_generated_attendance_for_days.push(x)
                                                        let total_leaves = 0;
                                                        if (dates[dates.length - 1] === x && half_day !== "") {
                                                            total_leaves = 0.5
                                                            
                                                        }
                                                        else {
                                                            total_leaves =  1
                                                            
                                                        }
                                                        const {approved_leaves, unapproved_leaves} = check_result[0]
                                                        const update_generated_attendace_query = `update monthattendance set approved_leaves=?, unapproved_leaves=?  where month = ? and year =? and emp_id=?`
                                                        const update_generated_attendace_values = [approved_leaves+total_leaves, unapproved_leaves-1,month,year, emp_id]
            
                                                        const update_leave_status_query = `update balanceleaves set reference=? where reference=? and emp_id=?`
                                                        const update_leave_status_values = [`${id} + ${month},${year} Unapproved-Leaves Deduction`, `${month},${year} Unapproved-Leaves Deduction`, emp_id]
            
                                                        await db.promise().query(update_generated_attendace_query, update_generated_attendace_values)
                                                        await db.promise().query(update_leave_status_query, update_leave_status_values)
                                                        
            
                                                    }
                                                }
                                                console.log('add',update_balance_values)
                                                // const delete_balance_query =`delete from balanceleaves where debit!=0 and emp_id=? and date in(?)`
                                                // const delete_balance_value = [emp_id,dates.filter(date=>date!=='')]
                                                const update_balance_query = `insert into balanceleaves(emp_id,credit,debit,date,total_leaves,reference) values` + update_balance_query_params.join(',')
                                                // console.log('query:', update_balance_query)
                                                // console.log('values:', update_balance_values)
            
                                                const update_attendance_full_days_query = `update attendance set updated_status=? where pdate in (?) and emp_id=?`
                                                const update_attendance_full_days_values = ['EL', selected_dates.split(','), emp_id]
                                                const update_attendance_half_days_query = `update attendance set updated_status=? where pdate =? and emp_id=?`
                                                const update_attendance_half_days_values = ['XL', [half_day], emp_id]
                                                await db.promise().query(update_attendance_full_days_query, update_attendance_full_days_values)
                                                await db.promise().query(update_attendance_half_days_query, update_attendance_half_days_values)
                                                await db.promise().query(update_balance_query, update_balance_values)
            
                                            }
                                            else if (application_status === 'cancelled' && checkres[0].status === 'approved') {
                                                // console.log('cancel', 'com')
                                                // console.log('cancel', 'com')
                                                let total = 0
                                                if (result.length !== 0) {
                                                    total = result[0].total_leaves
                                                }
                                                let update_balance_query_params = []
                                                //const dates = (selected_dates + ',' + half_day).split(',')
                                                const update_balance_values = []
                                                //let total = result[0].total_leaves`
            
                                                // dates.forEach(date => {
                                                //     // console.log(date)
                                                //     if (date !== '') {
                                                //         update_balance_query_params.push('(?)')
                                                //         if (dates[dates.length - 1] === date && half_day !== "") {
                                                //             total = total + 0.5
                                                //             update_balance_values.push([emp_id, 0.5, 0, date, total, id])
                                                //         }
                                                //         else {
                                                //             total = total + 1
                                                //             update_balance_values.push([emp_id, 1, 0, date, total, id])
                                                //         }
                                                //     }
            
                                                // })
            
                                                for(let x of dates){
                                                    const date = new Date(x)
                                                    let month, year;
                                                    if(date.getDate()<=25){
                                                        month = months[date.getMonth()]
                                                        year = date.getFullYear()
                                                    }
                                                    else{
                                                        const new_date = new Date(date.getFullYear(),date.getMonth()+1,1)
                                                        month = months[new_date.getMonth()]
                                                        year = new_date.getFullYear()
                                                    }
                                                    const check_generated_attendace_query = `select * from monthattendance where month = ? and year =? and emp_id=?`
                                                    const check_generated_attendace_values = [month,year, emp_id]
                                                    const check_generated_attendace_result = await db.promise().query(check_generated_attendace_query, check_generated_attendace_values)
                                                    const check_result = check_generated_attendace_result[0]
                                                    if(check_result.length===0){
                                                        update_balance_query_params.push('(?)')
                                                        if (dates[dates.length - 1] === date && half_day !== "") {
                                                            total = total + 0.5
                                                            update_balance_values.push([emp_id, 0.5, 0, date, total, id])
                                                        }
                                                        else {
                                                            total = total + 1
                                                            update_balance_values.push([emp_id, 1, 0, date, total, id])
                                                        }
                                                    }
                                                    else{
                                                        //update_generated_attendance_for_days.push(x)
                                                        let total_leaves = 0;
                                                        if (dates[dates.length - 1] === x && half_day !== "") {
                                                            total_leaves = 0.5
                                                            
                                                        }
                                                        else {
                                                            total_leaves =  1
                                                            
                                                        }
                                                        const {approved_leaves, unapproved_leaves} = check_result[0]
                                                        console.log('approved/un-app',approved_leaves-total_leaves, unapproved_leaves+1)
                                                        const update_generated_attendace_query = `update monthattendance set approved_leaves=?, unapproved_leaves=?  where month = ? and year =? and emp_id=?`
                                                        const update_generated_attendace_values = [approved_leaves-total_leaves, unapproved_leaves+1,month,year, emp_id]
            
                                                        const update_leave_status_query = `update balanceleaves set reference=? where reference=? and emp_id=?`
                                                        const update_leave_status_values = [`${id} + ${month},${year} Unapproved-Leaves Deduction`, `${month},${year} Unapproved-Leaves Deduction`, emp_id]
            
                                                        await db.promise().query(update_generated_attendace_query, update_generated_attendace_values)
                                                        await db.promise().query(update_leave_status_query, update_leave_status_values)
                                                        
            
                                                    }
                                                }
                                                // const delete_balance_query =`delete from balanceleaves where debit!=0 and emp_id=? and date in(?)`
                                                // const delete_balance_value = [emp_id,dates.filter(date=>date!=='')]
                                                const update_balance_query = `insert into balanceleaves(emp_id,credit,debit,date,total_leaves,reference) values` + update_balance_query_params.join(',')
                                                // console.log('query:', update_balance_query)
                                                // console.log('values:', update_balance_values)
            
                                                const find_holidays_query = `select holiday_date from officeholidays inner join companypagesmanagement on pageId = id inner join usermanagement on usermanagement.company_name = companypagesmanagement.company_name where employee_id=? and officeholidays.department rlike usermanagement.department ;`
                                                const find_holidays_values = [emp_id]
            
                                                const holidays_result = await db.promise().query(find_holidays_query, find_holidays_values)
                                                const office_holidays = holidays_result[0].map(date => date.holiday_date.toLocaleString('en-CA').slice(0, 10))
            
                                                const find_user_shift_query = `select shift from usermanagement where employee_id = ?`
                                                const find_user_shift_value = [emp_id]
            
                                                const shift_result = await db.promise().query(find_user_shift_query, find_user_shift_value)
                                                const shift = shift_result[0][0].shift
            
            
                                                const update_attendance_query = `update attendance set updated_status = case when totalhrs<4 then 'AA' when totalhrs>=4 and totalhrs<${shift} then 'XA' when totalhrs>=${shift} then 'XX' when pdate in(?) then 'HH' else 'AA' end  where pdate in (?) and emp_id=?`
                                                //const dateRanges = [...selected_dates.split(','), half_day].filter(date => date !== '')
                                                const update_attendance_values = [office_holidays, dates, emp_id]
                                                await db.promise().query(update_balance_query, update_balance_values)
                                                await db.promise().query(update_attendance_query, update_attendance_values)
            
            
                                            }
                                            console.log('dates', dates, dates.length)
                                            for (let i = 0; i < dates.length; i++) {
                                                console.log(i, new Date(dates[i]))
                                                try {

                                                    await compensation(new Date(dates[i]), emp_id)


                                                }
                                                catch (err) {
                                                    console.log(err)
                                                    anyError = true
                                                    break
                                                }
                                            }
                                            transporter.sendMail(mailOptions, (err, info) => {
                                                if (err) {
                                                    // console.log(err)
                                                    return res.status(500).json('Not able send mail!')
                                                }
                                                else if (anyError) {
                                                    return res.cookie('HEADAUTHID', token, { maxAge: 172800000 }).status(200).json(`${application_status} but attendance updation got error contact admin!`)

                                                }
                                                else return res.cookie('HEADAUTHID', token, { maxAge: 172800000 }).status(200).json(application_status)
                                            })
                                            // console.log(result)
                                            //return res.cookie('HEADAUTHID', token, { maxAge: 172800000 }).status(200).json(application_status)



                                        }
                                        catch {
                                            return res.status(500).json('error occured!')
                                        }


                                    }

                                })


                            }
                            else {
                                res.cookie('HEADAUTHID', token, { maxAge: 172800000 }).status(200).json(`already ${checkres[0].status}`)

                            }

                        }
                        else {
                            return res.status(401).json('Invalid email/password!')
                        }
                    }
                })

            }
            //res.send('ok')
        }

    })



}


export const checkapplicationerequest = (req, res) => {
    const { status, applicationId } = req.body
    const token = req.cookies.HEADAUTHID
    const data = jwt.verify(token, process.env.HEAD_JWT_SECRET)
    const { email } = data

    // console.log(data)
    const check_application_query = `select id, applicant_name, applicant_email, emp_id, from_date, to_date, leave_type, leave_option, selected_dates, half_day, total_leaves,first_name,last_name,employee_id,applyleaves.status from applyleaves inner join usermanagement on email=mail_approved_by where mail_approved_by=? and id=?`
    const check_application_values = [email, applicationId]
    db.query(check_application_query, check_application_values, async (checkerr, checkres) => {
        if (checkerr) {
            console.log(checkerr)
            return res.status(500).json('error occured!')

        }

        //res.send('ok')
        else {
            // console.log(checkres)
            if (checkres.length === 0) {
                return res.clearCookie('HEADAUTHID').status(401).json('Unauthorized Application')
            }
            else {
                let application_status;
                switch (status) {
                    case 'approve':
                        application_status = 'approved'
                        break
                    case 'deny':
                        application_status = 'denied'
                        break
                    case 'cancel':
                        application_status = 'cancelled'
                        break
                    default:
                        application_status = 'NA'
                        break

                }
                const mail_templte = application_status === 'approved' ? 'LeaveRequestApproved' : application_status === 'denied' ? 'LeaveRequestDenied' : 'LeaveRequestCancelled'
                const { id, applicant_name, applicant_email, emp_id, from_date, to_date, leave_type, leave_option, selected_dates, half_day, total_leaves, first_name, last_name, employee_id } = checkres[0]
                const mailOptions = {
                    from: `"${first_name} ${last_name}" <${applicant_email}`,
                    to: [applicant_email],
                    subject: 'Your Request is ' + `${application_status}`.toUpperCase(),
                    template: mail_templte,
                    context: {
                        to: `${applicant_name}(bcg/${emp_id})`,
                        from_date: from_date !== '' ? from_date : 'NA',
                        to_date: to_date !== '' ? to_date : 'NA',
                        leave_type: leave_type,
                        leave_option: leave_option,
                        full_days: selected_dates !== '' ? selected_dates : 'NA',
                        half_days: half_day !== '' ? half_day : 'NA',
                        total_leaves: total_leaves,
                        approved_by: `${first_name} ${last_name} (bcg/${employee_id})`,
                        status: application_status
                    }
                }
                if ((checkres[0].status === 'pending' && (application_status === 'approved' || application_status === 'denied')) || (checkres[0].status === 'approved' && application_status === 'cancelled')) {

                    // console.log(checkres)

                    const q = `select total_leaves from balanceleaves where emp_id=? order by id desc limit 1 `
                    const v = [emp_id]
                    db.query(q, v, async (err, result) => {
                        if (err) {
                            console.log('total leaves', err)
                            return res.status(500).json('error occured!')
                        }
                        else {
                            // console.log('balence', result)
                            let anyError = false
                            try {

                                const update_application_query = `update applyleaves set status=? where id=?`
                                const update_application_values = [application_status, applicationId]
                                await db.promise().query(update_application_query, update_application_values)
                                const dates = [...selected_dates.split(','), half_day].filter(date => date !== '')
                                console.log('dates', dates)
                                
                                if (application_status === 'approved') {
                                    // console.log('approval')
                                    let total = 0
                                    if (result.length !== 0) {
                                        total = result[0].total_leaves
                                    }
                                    let update_balance_query_params = []

                                    const update_balance_values = []
                                    //let total = result[0].total_leaves


                                    // dates.forEach(date => {
                                    //     // console.log(date)
                                    //     if (date !== '') {
                                    //         update_balance_query_params.push('(?)')
                                    //         if (dates[dates.length - 1] === date && half_day !== "") {
                                    //             total = total - 0.5
                                    //             update_balance_values.push([emp_id, 0, 0.5, date, total, id])
                                    //         }
                                    //         else {
                                    //             total = total - 1
                                    //             update_balance_values.push([emp_id, 0, 1, date, total, id])
                                    //         }
                                    //     }

                                    // })

                                    //const update_generated_attendance_for_days = []
                                    for(let x of dates){
                                        const date = new Date(x)
                                        let month, year;
                                        if(date.getDate()<=25){
                                            month = months[date.getMonth()]
                                            year = date.getFullYear()
                                        }
                                        else{
                                            const new_date = new Date(date.getFullYear(),date.getMonth()+1,1)
                                            month = months[new_date.getMonth()]
                                            year = new_date.getFullYear()
                                        }
                                        console.log('month/year:', month, year)
                                        const check_generated_attendace_query = `select * from monthattendance where month = ? and year =? and emp_id=?`
                                        const check_generated_attendace_values = [month,year,emp_id]
                                        const check_generated_attendace_result = await db.promise().query(check_generated_attendace_query, check_generated_attendace_values)
                                        const check_result = check_generated_attendace_result[0]
                                        console.log('check_result',check_result.length)
                                        if(check_result.length===0){
                                            update_balance_query_params.push('(?)')
                                            console.log('consider', x)
                                            if (dates[dates.length - 1] === x && half_day !== "") {
                                                total = total - 0.5
                                                update_balance_values.push([emp_id, 0, 0.5, x, total, id])
                                            }
                                            else {
                                                total = total - 1
                                                update_balance_values.push([emp_id, 0, 1, x, total, id])
                                            }
                                        }
                                        else{
                                            console.log('wont consider', x)
                                            //update_generated_attendance_for_days.push(x)
                                            let total_leaves = 0;
                                            if (dates[dates.length - 1] === x && half_day !== "") {
                                                total_leaves = 0.5
                                                
                                            }
                                            else {
                                                total_leaves =  1
                                                
                                            }
                                            const {approved_leaves, unapproved_leaves} = check_result[0]
                                            const update_generated_attendace_query = `update monthattendance set approved_leaves=?, unapproved_leaves=?  where month = ? and year =? and emp_id=?`
                                            const update_generated_attendace_values = [approved_leaves+total_leaves, unapproved_leaves-1,month,year, emp_id]

                                            const update_leave_status_query = `update balanceleaves set reference=? where reference=? and emp_id=?`
                                            const update_leave_status_values = [`${id} + ${month},${year} Unapproved-Leaves Deduction`, `${month},${year} Unapproved-Leaves Deduction`, emp_id]

                                            await db.promise().query(update_generated_attendace_query, update_generated_attendace_values)
                                            await db.promise().query(update_leave_status_query, update_leave_status_values)
                                            

                                        }
                                    }
                                    console.log('add',update_balance_values)
                                    // const delete_balance_query =`delete from balanceleaves where debit!=0 and emp_id=? and date in(?)`
                                    // const delete_balance_value = [emp_id,dates.filter(date=>date!=='')]
                                    const update_balance_query = `insert into balanceleaves(emp_id,credit,debit,date,total_leaves,reference) values` + update_balance_query_params.join(',')
                                    // console.log('query:', update_balance_query)
                                    // console.log('values:', update_balance_values)

                                    const update_attendance_full_days_query = `update attendance set updated_status=? where pdate in (?) and emp_id=?`
                                    const update_attendance_full_days_values = ['EL', selected_dates.split(','), emp_id]
                                    const update_attendance_half_days_query = `update attendance set updated_status=? where pdate =? and emp_id=?`
                                    const update_attendance_half_days_values = ['XL', [half_day], emp_id]
                                    await db.promise().query(update_attendance_full_days_query, update_attendance_full_days_values)
                                    await db.promise().query(update_attendance_half_days_query, update_attendance_half_days_values)
                                    await db.promise().query(update_balance_query, update_balance_values)

                                }
                                else if (application_status === 'cancelled' && checkres[0].status === 'approved') {
                                    // console.log('cancel', 'com')
                                    // console.log('cancel', 'com')
                                    let total = 0
                                    if (result.length !== 0) {
                                        total = result[0].total_leaves
                                    }
                                    let update_balance_query_params = []
                                    //const dates = (selected_dates + ',' + half_day).split(',')
                                    const update_balance_values = []
                                    //let total = result[0].total_leaves`

                                    // dates.forEach(date => {
                                    //     // console.log(date)
                                    //     if (date !== '') {
                                    //         update_balance_query_params.push('(?)')
                                    //         if (dates[dates.length - 1] === date && half_day !== "") {
                                    //             total = total + 0.5
                                    //             update_balance_values.push([emp_id, 0.5, 0, date, total, id])
                                    //         }
                                    //         else {
                                    //             total = total + 1
                                    //             update_balance_values.push([emp_id, 1, 0, date, total, id])
                                    //         }
                                    //     }

                                    // })

                                    for(let x of dates){
                                        const date = new Date(x)
                                        let month, year;
                                        if(date.getDate()<=25){
                                            month = months[date.getMonth()]
                                            year = date.getFullYear()
                                        }
                                        else{
                                            const new_date = new Date(date.getFullYear(),date.getMonth()+1,1)
                                            month = months[new_date.getMonth()]
                                            year = new_date.getFullYear()
                                        }
                                        const check_generated_attendace_query = `select * from monthattendance where month = ? and year =? and emp_id=?`
                                        const check_generated_attendace_values = [month,year, emp_id]
                                        const check_generated_attendace_result = await db.promise().query(check_generated_attendace_query, check_generated_attendace_values)
                                        const check_result = check_generated_attendace_result[0]
                                        if(check_result.length===0){
                                            update_balance_query_params.push('(?)')
                                            if (dates[dates.length - 1] === date && half_day !== "") {
                                                total = total + 0.5
                                                update_balance_values.push([emp_id, 0.5, 0, date, total, id])
                                            }
                                            else {
                                                total = total + 1
                                                update_balance_values.push([emp_id, 1, 0, date, total, id])
                                            }
                                        }
                                        else{
                                            //update_generated_attendance_for_days.push(x)
                                            let total_leaves = 0;
                                            if (dates[dates.length - 1] === x && half_day !== "") {
                                                total_leaves = 0.5
                                                
                                            }
                                            else {
                                                total_leaves =  1
                                                
                                            }
                                            const {approved_leaves, unapproved_leaves} = check_result[0]
                                            console.log('approved/un-app',approved_leaves-total_leaves, unapproved_leaves+1)
                                            const update_generated_attendace_query = `update monthattendance set approved_leaves=?, unapproved_leaves=?  where month = ? and year =? and emp_id=?`
                                            const update_generated_attendace_values = [approved_leaves-total_leaves, unapproved_leaves+1,month,year, emp_id]

                                            const update_leave_status_query = `update balanceleaves set reference=? where reference=? and emp_id=?`
                                            const update_leave_status_values = [`${id} + ${month},${year} Unapproved-Leaves Deduction`, `${month},${year} Unapproved-Leaves Deduction`, emp_id]

                                            await db.promise().query(update_generated_attendace_query, update_generated_attendace_values)
                                            await db.promise().query(update_leave_status_query, update_leave_status_values)
                                            

                                        }
                                    }
                                    // const delete_balance_query =`delete from balanceleaves where debit!=0 and emp_id=? and date in(?)`
                                    // const delete_balance_value = [emp_id,dates.filter(date=>date!=='')]
                                    const update_balance_query = `insert into balanceleaves(emp_id,credit,debit,date,total_leaves,reference) values` + update_balance_query_params.join(',')
                                    // console.log('query:', update_balance_query)
                                    // console.log('values:', update_balance_values)

                                    const find_holidays_query = `select holiday_date from officeholidays inner join companypagesmanagement on pageId = id inner join usermanagement on usermanagement.company_name = companypagesmanagement.company_name where employee_id=? and officeholidays.department rlike usermanagement.department ;`
                                    const find_holidays_values = [emp_id]

                                    const holidays_result = await db.promise().query(find_holidays_query, find_holidays_values)
                                    const office_holidays = holidays_result[0].map(date => date.holiday_date.toLocaleString('en-CA').slice(0, 10))

                                    const find_user_shift_query = `select shift from usermanagement where employee_id = ?`
                                    const find_user_shift_value = [emp_id]

                                    const shift_result = await db.promise().query(find_user_shift_query, find_user_shift_value)
                                    const shift = shift_result[0][0].shift


                                    const update_attendance_query = `update attendance set updated_status = case when totalhrs<4 then 'AA' when totalhrs>=4 and totalhrs<${shift} then 'XA' when totalhrs>=${shift} then 'XX' when pdate in(?) then 'HH' else 'AA' end  where pdate in (?) and emp_id=?`
                                    //const dateRanges = [...selected_dates.split(','), half_day].filter(date => date !== '')
                                    const update_attendance_values = [office_holidays, dates, emp_id]
                                    await db.promise().query(update_balance_query, update_balance_values)
                                    await db.promise().query(update_attendance_query, update_attendance_values)


                                }
                                //console.log('dates', dates, dates.length)
                                for (let i = 0; i < dates.length; i++) {
                                    console.log(i, new Date(dates[i]))
                                    try {

                                        const companisate = await compensation(new Date(dates[i]), emp_id)
                                        console.log(companisate)

                                    }
                                    catch (err) {
                                        console.log(err)
                                        anyError = true
                                        break
                                    }
                                }
                                transporter.sendMail(mailOptions, (err, info) => {

                                    if (err) {
                                        // console.log(err, anyError)
                                        return res.status(500).json('Not able send mail!')
                                    }
                                    else if (anyError) {
                                        return res.status(200).json(`${application_status} but attendance updation got error contact admin!`)

                                    }
                                    else {
                                        // console.log('mail')
                                        return res.status(200).json(application_status)
                                    }
                                })
                                return res.status(200).json(application_status)
                            }


                            catch (err) {
                                console.log('final loop end', err)
                                return res.status(500).json('error occured!')
                            }




                        }
                    })



                }
                else {
                    res.status(200).json(`already ${checkres[0].status}`)
                }

            }
        }
    })


}




export const cancelapplication = async (req, res) => {
    // console.log(req.body)
    const { id, mail_approved_by, balence_leaves, cc_mail, leave_type, leave_options, selected_dates, half_day, total_leaves, status, reason, emp_id, applicant_name, applicant_email } = req.body

    if (status === 'pending') {
        const update_application_query = `update applyleaves set status ='cancelled' where id =?`
        const update_application_values = [id]
        try {
            await db.promise().query(update_application_query, update_application_values)
            return res.status(200).json('Your request canceled successfully')
        }
        catch (err) {
            // console.log(err)
            return res.status(500).json('error occured!')
        }

    }
    else if (status === 'approved') {
        const reporting_head_name_quary = `select concat(first_name,' ', last_name) as name from usermanagement where email=? and status = 'active'`
        const reporting_head_name_value = [mail_approved_by]
        db.query(reporting_head_name_quary, reporting_head_name_value, (error, result) => {
            if (error) return res.status(500).json('error occured!')
            else {
                if (result.length === 0) {
                    return res.status(406).json('Reporting Might be Not Active Contact Admin!')
                }
                else {
                    const reporting_head_name = result[0].name
                    const mailOptions = {
                        from: `"${applicant_name}" <${applicant_email}`,
                        to: [mail_approved_by],
                        cc: cc_mail.split(','),
                        subject: 'Cancel The Leave Request',
                        template: 'LeaveRequestCancelApplication',
                        context: {
                            reporting_head: reporting_head_name,
                            applicant_name: applicant_name,
                            applicant_emp_id: emp_id,
                            total_leaves: total_leaves,
                            balence_leaves: balence_leaves,
                            reason: reason,
                            leave_type: leave_type,
                            leave_option: leave_options,
                            selected_dates: selected_dates !== '' ? selected_dates : 'NA',
                            half_day: half_day !== '' ? half_day : 'NA',
                            cancel_request: `http://localhost:3000/reportingheadlogin/application/cancel?id=${id}`
                        }
                    }

                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            // console.log(err)
                            return res.status(500).json('Not able send mail!')
                        }
                        else return res.status(201).json('Mail sended to your corresponding reporting head for Cancellation')
                    })
                }
            }
        })



    }
    else {
        return res.send('ok')
    }


}


export const getbalanceleaves = (req, res) => {
    const { emp_id } = req.body
    const q = `select * from balanceleaves where emp_id=? order by id desc; `
    const v = [emp_id]
    db.query(q, v, (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            // console.log('balence', result)
            if (result.length == 0) {
                return res.status(200).json({ balanceSheet: [], totalLeaves: 0 })
            }
            else {
                return res.status(200).json({ balanceSheet: result, totalLeaves: result[0].total_leaves })
            }
        }
    })

}




//--------------history log------------//

export const historylogapplication = (req, res) => {
    // console.log(req.body)
    const { applicationType, fromDate, toDate, emp_id } = req.body
    let searchLogQuery, searchLogValues;
    switch (applicationType) {
        case 'Leave':
            searchLogQuery = `select * from applyleaves where ((from_date >= ? and from_date <= ?) or (half_day>=? and half_day<=?)) and emp_id=?`
            searchLogValues = [fromDate, toDate, fromDate, toDate, emp_id]
    }
    db.query(searchLogQuery, searchLogValues, (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            // console.log(result)
            return res.status(200).json(result)

        }
    })
    //res.send('ok')
}

export const searchapplication = (req, res) => {
    const { applicationId } = req.body
    const searchLogQuery = `select * from applyleaves where id=?`
    const searchLogValues = [applicationId]
    db.query(searchLogQuery, searchLogValues, (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            // console.log(result)
            return res.status(200).json(result)

        }
    })

}



