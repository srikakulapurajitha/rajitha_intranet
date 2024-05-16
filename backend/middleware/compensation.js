import db from "../config/connectiondb.js";

const compensation = async (date, emp_id) => {
    return new Promise(async (resolve, reject) => {
        try {

            console.log('compansation working')
            console.log(date, emp_id)


            const find_user_shift_query = `select shift from usermanagement where employee_id = ?`
            const find_user_shift_value = [emp_id]

            const shift_result = await db.promise().query(find_user_shift_query, find_user_shift_value)
            const shift = shift_result[0][0].shift
            //console.log('shift', typeof shift) 

            const current_year = date.getFullYear()
            const current_month = date.getMonth()
            let from_date, to_date;

            if (date.getDate() >= 26) {
                from_date = new Date(Date.UTC(current_year, current_month, 26))
                to_date = new Date(Date.UTC(current_year, current_month + 1, 25))
            }
            else {
                from_date = new Date(Date.UTC(current_year, current_month - 1, 26))
                to_date = new Date(Date.UTC(current_year, current_month, 25))
            }

            const check_attendance_query = `select * from attendance where pdate>=date(?) and pdate<=date(?) and emp_id = ?`
            const check_attendance_values = [from_date, to_date, emp_id]

            const check_result = await db.promise().query(check_attendance_query, check_attendance_values)

            //console.log('dates', from_date,to_date)
            //------------------------------prev logic---------------------------------------------------------------------

            
            // const attendance = check_result[0]
            // //console.log('atte',attendance)
            // //const result = attendance.filter(data=>data.updated_status!=='XX'&&data.updated_status!=='XA'&&data.updated_status!=='AA')
            // //const hr_list = attendance.filter(data=>data.updated_status!=='XL').map(a => considered_weekoff.includes(new Date(a.pdate).toLocaleString('en-CA').slice(0,10))?0:office_holidays.includes(new Date(a.pdate).toLocaleString('en-CA').slice(0,10))?0:a.totalhrs <= 4 ? 0 : a.totalhrs)
            // const hr_list = attendance.filter(data => data.updated_status === 'XX' || data.updated_status === 'XA').map(a => a.totalhrs)

            // console.log('HRLIST', hr_list)
            // const totalhr = hr_list.reduce((acc, curr_value) => acc + (Math.trunc(curr_value)), 0)
            // const totalmin = hr_list.reduce((acc, curr_value) => acc + (curr_value % 1).toFixed(2) * 100, 0)
            // const totalShift = hr_list.length * shift * 60 //in min
            // const halfDayShift = attendance.filter(data => data.updated_status === 'XL' && data.totalhrs >= 4).map(att => att.totalhrs)
            // const totalHalfDayShift = halfDayShift.length * 4 * 60
            // const totalhrHalfDayShift = halfDayShift.reduce((acc, curr_value) => acc + (Math.trunc(curr_value)), 0)
            // const totalminHalfDayShift = halfDayShift.reduce((acc, curr_value) => acc + (curr_value % 1).toFixed(2) * 100, 0)
            // //const halfDayShiftWorked = halfDayShift.length*4

            // //const abbsent = attendance.filter(att=>)
            // const totalHalfDayPresent = ((totalhrHalfDayShift * 60) + totalminHalfDayShift) - totalHalfDayShift
            // console.log('half',totalHalfDayShift,halfDayShift,totalhrHalfDayShift,totalminHalfDayShift)
            // console.log('full',totalhr, totalmin, totalShift)
            // //console.log('half',totalHalfDayPresent)
            // //const totalNonWorked = (hr_list.filter(hr => hr === 0).length) * shift * 60 //
            // const totalWorked = ((totalhr * 60) + totalmin + totalHalfDayPresent) - totalShift //(totalShift - totalNonWorked)
            // const hr_bal = (Math.trunc(totalWorked / 60) + (totalWorked % 60) / 100).toFixed(2)
            // console.log(hr_bal)


            // // if (Number(hr_bal) < 0) {
            // //     //update_status_query = `update attendance set updated_status = 'XA' where  updated_status !='XX' and updated_status ='AA' and status !='AA'  and pdate>=date(?) and pdate<=date(?) and emp_id = ? `
            // //     update_status_query = `update attendance set updated_status = 'XA' where updated_status not in ('XX','CL','SL') and updated_status ='AA' and status !='AA' and pdate>=date(?) and pdate<=date(?) and emp_id = ? `
            // // }
            // if (totalWorked >= 0) {
            //     const update_status_query = `update attendance set updated_status = 'XX' where updated_status = 'XA' and totalhrs >= 4 and  pdate>=date(?) and pdate<=date(?) and emp_id = ? `
            //     await db.promise().query(update_status_query, [from_date, to_date, emp_id])
            // }
            // resolve('updated')

            //------------------------------prev logic---------------------------------------------------------------------

            //-------------------------------new advanced logic------------------------------------------------------------


            const attendance = check_result[0]

            const compensated_days = attendance.filter(data => data.updated_status === 'XX' ).map(att => att.totalhrs)
            
            const half_days = attendance.filter(data => data.updated_status === 'XL' ).map(att => att.totalhrs)

            const compensated_days_hrs = compensated_days.reduce((acc, curr_value) => acc + (Math.trunc(curr_value)), 0)
            const compensated_days_min = compensated_days.reduce((acc, curr_value) => acc + (curr_value % 1).toFixed(2) * 100, 0)
            const compensated_days_shift = compensated_days.length * shift * 60

            //console.log()


            const half_days_hrs = half_days.reduce((acc, curr_value) => acc + (Math.trunc(curr_value)), 0)
            const half_days_min = half_days.reduce((acc, curr_value) => acc + (curr_value % 1).toFixed(2) * 100, 0)
            const half_days_shift = half_days.length * 4 *60

            //console.log('time', ((compensated_days_hrs*60+compensated_days_min)-compensated_days_shift) , ((half_days_hrs*60+half_days_min)-half_days_shift), 'halfdays', half_days, half_days_hrs,half_days_min,half_days_shift )

            const extra_time = ((compensated_days_hrs*60+compensated_days_min)-compensated_days_shift) + ((half_days_hrs*60+half_days_min)-half_days_shift)
            //console.log('extre time',extra_time)

            if(extra_time>0){
                const not_compensated_days = attendance.filter(data => data.updated_status === 'XA' ).map(att => {
                    const {pdate, totalhrs} = att
                    const hr = Math.trunc(totalhrs)
                    const min = (totalhrs % 1).toFixed(2) * 100
                    const cal = (hr*60+min)-shift*60
                    return {pdate:pdate, bal:cal}

                })
                const days_can_compensated = []
                //console.log('not comp',not_compensated_days)
                let extra_min = extra_time
                for(let i of not_compensated_days){
                //console.log(i)
                const bal_left = extra_min + i.bal
                if(0<=extra_min && bal_left>=0){
                    days_can_compensated.push(i)
                    extra_min = extra_min + i.bal
                    }
                }
                if(days_can_compensated.length!==0){
                    const days = days_can_compensated.map(att=>att.pdate)
                    //console.log(extra_time,days_can_compensated)
                    const update_status_query = `update attendance set updated_status = 'XX' where updated_status = 'XA' and totalhrs >= 4 and pdate in (?) and emp_id = ? `
                    await db.promise().query(update_status_query, [days,emp_id])
                }
                

            }
            resolve('updated')

            //-------------------------------new advanced logic------------------------------------------------------------      


        }
        catch (err) {
            console.log(err)
            reject('error occured!')
        }
    });
}



export default compensation