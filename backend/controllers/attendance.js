import multer from "multer"
import decompress from "decompress";
import fs from 'fs'
import reader from "xlsx";
import db from "../config/connectiondb.js";
import compensation from "../middleware/compensation.js";

const storege = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
        //console.log(file.originalname)

        cb(null, file.originalname)
    },
})

export const uploadStorage = multer({ storage: storege })


const WeekOffDays = async (date) => {
    return new Promise((resolve) => {
        const sat = []; // Saturdays
        const sun = []; // Sundays
        let from_date, to_date;
        const day = date.getDate()
        const month = date.getMonth()
        const year = date.getFullYear()
        if (day >= 26) {
            from_date = new Date(year, month, 26);
            to_date = new Date(year, month + 1, 25);
        }
        else {
            from_date = new Date(year, month - 1, 26);
            to_date = new Date(year, month, 25);
        }

        let startDate = new Date(from_date);

        while (startDate <= to_date) {
            if (startDate.getDay() === 0) { // if Sunday
                sun.push(startDate.toLocaleString('en-CA').slice(0, 10));
            }
            if (startDate.getDay() === 6) { // if Saturday
                sat.push(startDate.toLocaleString('en-CA').slice(0, 10));
            }

            startDate.setDate(startDate.getDate() + 1); // Move to the next day
        }

        resolve({ sat: sat, sun: sun });
    });
}


export const UploadFile = async (req, res) => {
    // const leaveTypes = {
    //     'Casual': 'CL',
    //     'Special': 'SL'
    // }

    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const ProjectPath = process.cwd()


        //console.log('file', req.files)
        const name = req.files[0].originalname
        if (name !== undefined) {
            decompress(ProjectPath + "\\uploads\\" + name, ProjectPath + "\\uploads\\ExtractedFiles\\")
                .then((files) => {
                    //console.log(files)
                    let startReadFile

                    if (files.length === 0) {
                        ////console.log('len 0')
                        fs.rmSync(ProjectPath + "\\uploads\\ExtractedFiles\\" + (name).slice(0, name.lastIndexOf('.')), { recursive: true, force: true })
                        fs.unlinkSync(ProjectPath + "\\uploads\\" + name)
                        //fs.unlink(ProjectPath+"\\uploads\\ExtractedFiles\\"+name)
                        return res.status(413).json('zip not containing files!')
                    }
                    else if (files.length == 1 && files[0].type === 'directory') {
                        ////console.log('len 1 dir')
                        fs.rmSync(ProjectPath + "\\uploads\\ExtractedFiles\\" + (name).slice(0, name.lastIndexOf('.')), { recursive: true, force: true })
                        fs.unlinkSync(ProjectPath + "\\uploads\\" + name)
                        return res.status(413).json('zip not containing files!')
                    }
                    else {

                        ////console.log(files[1])
                        ////console.log((files[1].path).slice(files[1].path.lastIndexOf('.'),))

                        if (files[0].type === 'directory') {
                            //console.log('dir')
                            if ((files[1].path).slice(files[1].path.lastIndexOf('.'),) !== '.xlsx' && (files[1].path).slice(files[1].path.lastIndexOf('.'),) !== '.csv') {
                                fs.rmSync(ProjectPath + "\\uploads\\ExtractedFiles\\" + (name).slice(0, name.lastIndexOf('.')), { recursive: true, force: true })
                                fs.unlinkSync(ProjectPath + "\\uploads\\" + name)
                                return res.status(413).json('zip not containing excel sheets')
                            }
                            else {

                                startReadFile = 1
                            }
                        }
                        else {
                            // //console.log('file type')
                            //console.log((files[0].path).slice(files[0].path.lastIndexOf('.'),))
                            // //console.log((name).slice(0,name.lastIndexOf('.')))
                            if ((files[0].path).slice(files[0].path.lastIndexOf('.'),) !== '.xlsx' && (files[0].path).slice(files[0].path.lastIndexOf('.'),) !== '.csv') {
                                fs.rmSync(ProjectPath + "\\uploads\\ExtractedFiles\\" + (name).slice(0, name.lastIndexOf('.')), { recursive: true, force: true })
                                fs.unlinkSync(ProjectPath + "\\uploads\\" + name)
                                return res.status(413).json('zip not containing excel sheets')
                            }
                            else {
                                startReadFile = 0
                            }
                        }
                        //return res.send('ok')
                        let anyError = false
                        files.slice(startReadFile,).forEach(async (filedata) => {
                            const filepath = ProjectPath + "\\uploads\\ExtractedFiles\\" + filedata.path.replace('/', '\\')
                            ////console.log(filepath)
                            const readFile = reader.readFile(filepath)
                            const sheets = readFile.SheetNames
                            ////console.log(sheets)
                            for (let i = 0; i < sheets.length; i++) {
                                const temp = reader.utils.sheet_to_json(
                                    readFile.Sheets[readFile.SheetNames[i]])
                                for (let j = 0; j < temp.length; j++) {
                                    let filedata = temp[j]


                                    //temp.forEach((filedata) => {
                                    //console.log(filedata)
                                    let { Emp_code, PDate, firstin, LastOut, Status, totlhrs } = filedata
                                    //console.log(Emp_code, PDate, firstin, LastOut, Status, totlhrs)
                                    if (Emp_code === undefined || PDate === undefined || firstin === undefined || LastOut === undefined || Status === undefined || totlhrs === undefined) {
                                        anyError = true
                                        break
                                    }
                                    else {
                                        //console.log(Emp_code, PDate, firstin, LastOut, Status, totlhrs)

                                        const punchDate = new Date(Date.UTC(0, 0, PDate - 1))
                                        //console.log('pdate', punchDate)




                                        try {
                                            // if record is there we will delete and freshly we will add again
                                            const delete_record_query = `delete from attendance where emp_id=? and pdate=date(?)`
                                            const delete_record_values = [Emp_code, punchDate]

                                            await db.promise().query(delete_record_query, delete_record_values)




                                            //check holidays, leaves and weekoff
                                            const weekoffs = await WeekOffDays(punchDate)
                                            //console.log(weekoffs.sat)


                                            const find_user_shift_query = `select shift from usermanagement where employee_id = ?`
                                            const find_user_shift_value = [Emp_code]

                                            const shift_result = await db.promise().query(find_user_shift_query, find_user_shift_value)
                                            const shift = shift_result[0][0].shift
                                            //console.log('shift', typeof shift)

                                            // consider weekoffs based on shift ex:9hr shift means consider 2day week off(sat,sun) 

                                            let considered_weekoff, office_holidays, full_day_leave, half_day_leave;
                                            if (shift === 9) {
                                                considered_weekoff = [...weekoffs.sat, ...weekoffs.sun]
                                            }
                                            else {
                                                considered_weekoff = weekoffs.sun
                                            }

                                            const find_holidays_query = `select holiday_date from officeholidays inner join companypagesmanagement on pageId = id inner join usermanagement on usermanagement.company_name = companypagesmanagement.company_name where employee_id=? and officeholidays.department rlike usermanagement.department ;`
                                            const find_holidays_values = [Emp_code]

                                            const holidays_result = await db.promise().query(find_holidays_query, find_holidays_values)
                                            office_holidays = holidays_result[0].map(date => date.holiday_date.toLocaleString('en-CA').slice(0, 10))

                                            const find_leaves_query = `select selected_dates,half_day from applyleaves where (selected_dates rlike ? or half_day rlike ?) and status='approved' and emp_id=?;`
                                            const find_leaves_values = [punchDate.toJSON().slice(0, 10), punchDate.toJSON().slice(0, 10), Emp_code]
                                            const leaves_result = await db.promise().query(find_leaves_query, find_leaves_values)
                                            const leaves = leaves_result[0]
                                            //console.log(leaves)
                                            if (leaves.length !== 0) {
                                                if (leaves[0].selected_dates.split(',').includes(punchDate.toJSON().slice(0, 10))) {
                                                    full_day_leave = true
                                                    half_day_leave = false
                                                }
                                                else if (leaves[0].half_day === punchDate.toJSON().slice(0, 10)) {
                                                    full_day_leave = false
                                                    half_day_leave = true
                                                }
                                            }
                                            else {
                                                full_day_leave = false
                                                half_day_leave = false
                                            }

                                            //console.log(considered_weekoff,office_holidays,full_day_leave,half_day_leave)
                                            let updated_status = 'AA';
                                            if (totlhrs < 4) {
                                                updated_status = 'AA'
                                            }
                                            else if (totlhrs >= shift) {
                                                updated_status = 'XX'
                                            }
                                            else if (totlhrs >= 4 && totlhrs < shift) {
                                                updated_status = 'XA'
                                            }
                                            if (considered_weekoff.includes(punchDate.toLocaleString('en-CA').slice(0, 10))) {
                                                updated_status = 'WH'
                                            }
                                            else if (office_holidays.includes(punchDate.toLocaleString('en-CA').slice(0, 10))) {
                                                Status = 'HH'
                                                updated_status = 'HH'
                                            }
                                            if (full_day_leave) {
                                                updated_status = 'EL'
                                            }
                                            else if (half_day_leave) {
                                                updated_status = 'XL'
                                            }

                                            // inserting record based on updated_status
                                            const insert_record_query = 'insert into attendance(emp_id,pdate,firstin,lastout,status,totalhrs,updated_status) values (?,date(?),?,?,?,?,?)'
                                            const insert_record_values = [Emp_code, punchDate, firstin, LastOut, Status, totlhrs, updated_status]
                                            await db.promise().query(insert_record_query, insert_record_values)


                                            // after insertion will do compensation

                                            await compensation(punchDate, Emp_code)





                                            // const current_year = punchDate.getFullYear()
                                            // const current_month = punchDate.getMonth()
                                            // let from_date, to_date;

                                            // if (punchDate.getDate() >= 26) {
                                            //     from_date = new Date(Date.UTC(current_year, current_month, 26))
                                            //     to_date = new Date(Date.UTC(current_year, current_month + 1,25))
                                            // }
                                            // else {
                                            //     from_date = new Date(Date.UTC(current_year, current_month - 1, 26))
                                            //     to_date = new Date(Date.UTC(current_year, current_month , 25))
                                            // }

                                            // //console.log('dates', from_date,to_date)

                                            // const check_attendance_query =  `select * from attendance where pdate>=date(?) and pdate<=date(?) and emp_id = ?`
                                            // const check_attendance_values = [from_date, to_date, Emp_code]

                                            // const check_result = await db.promise().query(check_attendance_query,check_attendance_values)
                                            // const attendance = check_result[0]
                                            // //console.log('atte',attendance)
                                            // //const result = attendance.filter(data=>data.updated_status!=='XX'&&data.updated_status!=='XA'&&data.updated_status!=='AA')
                                            // //const hr_list = attendance.filter(data=>data.updated_status!=='XL').map(a => considered_weekoff.includes(new Date(a.pdate).toLocaleString('en-CA').slice(0,10))?0:office_holidays.includes(new Date(a.pdate).toLocaleString('en-CA').slice(0,10))?0:a.totalhrs <= 4 ? 0 : a.totalhrs)
                                            // const hr_list = attendance.filter(data=>data.updated_status==='XX'||data.updated_status==='XA').map(a => a.totalhrs)

                                            // //console.log('HRLIST',hr_list)
                                            // const totalhr = hr_list.reduce((acc, curr_value) => acc + (Math.trunc(curr_value)), 0)
                                            // const totalmin = hr_list.reduce((acc, curr_value) => acc + (curr_value % 1).toFixed(2) * 100, 0)
                                            // const totalShift = hr_list.length * shift * 60 //in min
                                            // const halfDayShift = attendance.filter(data=>data.updated_status==='XL'&& data.totalhrs>=4).map(att=>att.totalhrs)

                                            // const totalHalfDayShift = halfDayShift.length*4*60
                                            // console.log('Half HRLIST',halfDayShift, totalHalfDayShift)
                                            // const totalhrHalfDayShift = halfDayShift.reduce((acc, curr_value) => acc + (Math.trunc(curr_value)), 0)
                                            // const totalminHalfDayShift = halfDayShift.reduce((acc, curr_value) => acc + (curr_value % 1).toFixed(2) * 100, 0)
                                            // //const halfDayShiftWorked = halfDayShift.length*4

                                            // //const abbsent = attendance.filter(att=>)
                                            // const totalHalfDayPresent = ((totalhrHalfDayShift*60)+totalminHalfDayShift) - totalHalfDayShift
                                            // //console.log('half',totalHalfDayShift,halfDayShift,totalhrHalfDayShift,totalminHalfDayShift)
                                            // //console.log('half',totalHalfDayPresent)
                                            // //const totalNonWorked = (hr_list.filter(hr => hr === 0).length) * shift * 60 //
                                            // const totalWorked = ((totalhr * 60) + totalmin + totalHalfDayPresent) - totalShift //(totalShift - totalNonWorked)
                                            // const hr_bal = (Math.trunc(totalWorked / 60) + (totalWorked % 60) / 100).toFixed(2)
                                            // //console.log(hr_bal)



                                            // // if (Number(hr_bal) < 0) {
                                            // //     //update_status_query = `update attendance set updated_status = 'XA' where  updated_status !='XX' and updated_status ='AA' and status !='AA'  and pdate>=date(?) and pdate<=date(?) and emp_id = ? `
                                            // //     update_status_query = `update attendance set updated_status = 'XA' where updated_status not in ('XX','CL','SL') and updated_status ='AA' and status !='AA' and pdate>=date(?) and pdate<=date(?) and emp_id = ? `
                                            // // }
                                            // if(totalWorked>=0) {
                                            //     const update_status_query = `update attendance set updated_status = 'XX' where updated_status = 'XA' and totalhrs >= 4 and  pdate>=date(?) and pdate<=date(?) and emp_id = ? `
                                            //     await db.promise().query(update_status_query, [from_date, to_date, Emp_code])
                                            // }









                                        }
                                        catch (err) {
                                            console.log(err)
                                            anyError = true
                                            console.log(anyError)

                                            // return res.status(413).json("error occured check uploaded files not containing proper data")
                                            break



                                        }




                                        ////console.log('up-pdate', punchDate)

                                        // const check_applied_leave_query = `select * from applyleaves where (selected_dates rlike ? or half_day rlike ?) and status='approved' and emp_id=?;`
                                        // const check_applied_leave_values = [punchDate.toJSON().slice(0, 10), punchDate.toJSON().slice(0, 10),Emp_code]
                                        // db.query(check_applied_leave_query, check_applied_leave_values, (checkerr, checkres) => {

                                        //     if (checkerr){
                                        //         anyError=true
                                        //         return res.status(500).json('error occured!')
                                        //     } 
                                        //     else {
                                        //         let updatedStatus = 'AA'
                                        //         //console.log('checkres', checkres)
                                        //         if (['WH', 'HH'].includes(Status)) {
                                        //             updatedStatus = Status
                                        //         }
                                        //         else{
                                        //             if (totlhrs <= 4) {
                                        //                 Status = 'AA'
                                        //                 updatedStatus = 'AA'
                                        //             }
                                        //             else if (totlhrs >= 9) {
                                        //                 updatedStatus = 'XX'
                                        //             }
                                        //             if (checkres.length!==0){
                                        //                 const { selected_dates, half_day, leave_type } = checkres[0]
                                        //                 const choosedDates = selected_dates.split(',')
                                        //                 //console.log(punchDate.toJSON().slice(0, 10), choosedDates.includes(punchDate.toJSON().slice(0, 10)), half_day === punchDate.toJSON().slice(0, 10))

                                        //                 if (choosedDates.includes(punchDate.toJSON().slice(0, 10)) || half_day === punchDate.toJSON().slice(0, 10)) {
                                        //                     updatedStatus = leaveTypes[leave_type]
                                        //                 }

                                        //             }
                                        //         }

                                        //         console.log(updatedStatus)
                                        //         db.query('select * from attendance where emp_id=? and pdate=date(?)', [Emp_code, punchDate], async (atterr, attresult) => {
                                        //             if (atterr){
                                        //                 anyError=true
                                        //                 return res.status(500).json('error occured!')
                                        //             } 
                                        //             else {
                                        //                 //console.log(attresult)
                                        //                 try {
                                        //                     if (attresult.length === 0) {
                                        //                         const q = 'insert into attendance(emp_id,pdate,firstin,lastout,status,totalhrs,updated_status) values (?,date(?),?,?,?,?,?)'
                                        //                         const values = [Emp_code, punchDate, firstin, LastOut, Status, totlhrs, updatedStatus]
                                        //                         await db.promise().query(q, values)
                                        //                     }
                                        //                     else {
                                        //                         //console.log('updating')
                                        //                         const q = 'update attendance set emp_id=?, pdate=date(?),firstin=?,lastout=?,status=?,totalhrs=? where emp_id=? and pdate= date(?)'
                                        //                         const values = [Emp_code, punchDate, firstin, LastOut, Status, totlhrs, Emp_code, punchDate]
                                        //                         await db.promise().query(q, values)
                                        //                     }
                                        //                 }
                                        //                 catch (err) {
                                        //                     //console.log(err)
                                        //                     anyError=true
                                        //                     return ('error with excel data please check excel file!')
                                        //                 }

                                        //                 const current_date = new Date(punchDate)
                                        //                 const current_year = current_date.getFullYear()
                                        //                 const current_month = current_date.getMonth()
                                        //                 let from_date, to_date;
                                        //                 //new Date(Date.UTC(current_year,current_month,25)).toLocaleString()===new Date(Date.UTC(current_year,current_month,current_date.getDate())).toLocaleString()
                                        //                 // if (current_date.getDate() >= 26) {
                                        //                 //     from_date = new Date(Date.UTC(current_year, current_month, 26))
                                        //                 //     to_date = new Date(Date.UTC(current_year, current_month + 2,))
                                        //                 // }
                                        //                 // else {
                                        //                 //     from_date = new Date(Date.UTC(current_year, current_month - 1, 26))
                                        //                 //     to_date = new Date(Date.UTC(current_year, current_month + 1, 1))
                                        //                 // }
                                        //                 if (current_date.getDate() >= 26) {
                                        //                     from_date = new Date(Date.UTC(current_year, current_month, 26))
                                        //                     to_date = new Date(Date.UTC(current_year, current_month + 1,25))
                                        //                 }
                                        //                 else {
                                        //                     from_date = new Date(Date.UTC(current_year, current_month - 1, 26))
                                        //                     to_date = new Date(Date.UTC(current_year, current_month , 25))
                                        //                 }
                                        //                 //console.log('emp_id', Emp_code)
                                        //                 const check_status_query = `select * from attendance where pdate>=date(?) and pdate<=date(?) and emp_id = ?`
                                        //                 db.query(check_status_query, [from_date, to_date, Emp_code], (err, result) => {
                                        //                     if (err){
                                        //                         anyError=true
                                        //                         return ('error occured!')
                                        //                     } 
                                        //                     else {
                                        //                         //console.log('atte:', result)
                                        //                         const hr_list = result.map(a => a.totalhrs <= 4 ? 0 : a.totalhrs)
                                        //                         //console.log(hr_list)
                                        //                         const totalhr = hr_list.reduce((acc, curr_value) => acc + (Math.trunc(curr_value)), 0)
                                        //                         const totalmin = hr_list.reduce((acc, curr_value) => acc + (curr_value % 1).toFixed(2) * 100, 0)
                                        //                         const totalShift = hr_list.length * 9 * 60 //in min
                                        //                         const totalNonWorked = (hr_list.filter(hr => hr <= 4).length) * 9 * 60
                                        //                         const totalWorked = ((totalhr * 60) + totalmin) - (totalShift - totalNonWorked)
                                        //                         const hr_bal = (Math.trunc(totalWorked / 60) + (totalWorked % 60) / 100).toFixed(2)
                                        //                         console.log(hr_bal)
                                        //                         let update_status_query;
                                        //                         if (Number(hr_bal) < 0) {
                                        //                             //update_status_query = `update attendance set updated_status = 'XA' where  updated_status !='XX' and updated_status ='AA' and status !='AA'  and pdate>=date(?) and pdate<=date(?) and emp_id = ? `
                                        //                             update_status_query = `update attendance set updated_status = 'XA' where updated_status not in ('XX','CL','SL') and updated_status ='AA' and status !='AA' and pdate>=date(?) and pdate<=date(?) and emp_id = ? `
                                        //                         }
                                        //                         else {

                                        //                             update_status_query = `update attendance set updated_status = 'XX' where updated_status !='XX' and updated_status in ('AA','XA') and status !='AA' and pdate>=date(?) and pdate<=date(?) and emp_id = ? `
                                        //                         }
                                        //                         try {
                                        //                             db.promise().query(update_status_query, [from_date, to_date, Emp_code])


                                        //                         }
                                        //                         catch (err) {
                                        //                             //console.log(err) 
                                        //                             anyError=true                                                              
                                        //                             return res.status(500).json('error occured!')
                                        //                         }

                                        //                     }
                                        //                 })
                                        //             }
                                        //         })

                                        //     }
                                        // })


                                    }
                                }


                            }
                            console.log('eroor', anyError)
                            if (anyError) {
                                return res.status(413).json("error occured check uploaded files not containing proper data")


                            }
                            else {
                                console.log(anyError)
                                return res.send('file uploaded shortly... attendance may take time to update')
                            }

                        })




                    }
                })

        }
        else {
            return res.status(413).json('file not uploaded')
        }
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }


}

export const viewattendance = (req, res) => {
    const q = `select * from attendance order by pdate desc`
    db.query(q, (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            return res.status(200).json(result)
        }
    })
}

export const filterattendance = (req, res) => {
    //console.log(req.body)
    const { fromDate, toDate, emp_id } = req.body
    let q, v;
    if (emp_id !== '') {
        q = `select * from attendance where pdate >=? and pdate <=? and emp_id=? order by pdate`
        v = [fromDate, toDate, emp_id]
        ////console.log(emp_id)
    }
    else {
        q = `select * from attendance where pdate >=? and pdate <=?`
        v = [fromDate, toDate]
        ////console.log(emp_id)
    }

    db.query(q, v, (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            if (result.length === 0) {
                return res.status(406).json('No record found!')
            }
            else {
                return res.status(200).json(result)
            }
        }
    })
}

export const attendance = (req, res) => {
    //console.log(req.body)
    const current_date = new Date()
    const current_year = current_date.getFullYear()
    const current_month = current_date.getMonth()
    let from_date, to_date;
    //new Date(Date.UTC(current_year,current_month,25)).toLocaleString()===new Date(Date.UTC(current_year,current_month,current_date.getDate())).toLocaleString()
    if (current_date.getDate() >= 26) {
        from_date = new Date(Date.UTC(current_year, current_month, 26))
        to_date = new Date(Date.UTC(current_year, current_month + 1, 25))
    }
    else {
        from_date = new Date(Date.UTC(current_year, current_month - 1, 26))
        to_date = new Date(Date.UTC(current_year, current_month, 25))
    }
    const q = `select * from attendance where emp_id=? and pdate>=date(?) and pdate<=date(?)  order by pdate`
    const { emp_id } = req.body
    db.query(q, [emp_id, from_date, to_date], (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {

            return res.status(200).json(result)
        }
    })

}

export const filteruserattendance = (req, res) => {
    //console.log(req.body)
    const { fromDate, toDate, emp_id } = req.body
    const q = `select * from attendance where pdate >=? and pdate <=? and emp_id=? order by pdate`
    db.query(q, [fromDate, toDate, emp_id], (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            if (result.length === 0) {
                return res.status(406).json('No record found!')
            }
            else {
                return res.status(200).json(result)
            }
        }
    })
}

export const attendancegraphdata = (req, res) => {
    const { emp_id } = req.body
    const current_date = new Date()
    const current_year = current_date.getFullYear()
    const current_month = current_date.getMonth()
    let from_date, to_date;
    //new Date(Date.UTC(current_year,current_month,25)).toLocaleString()===new Date(Date.UTC(current_year,current_month,current_date.getDate())).toLocaleString()
    if (current_date.getDate() >= 26) {
        from_date = new Date(Date.UTC(current_year, current_month, 26))
        to_date = new Date(Date.UTC(current_year, current_month + 1, 25))
    }
    else {
        from_date = new Date(Date.UTC(current_year, current_month - 1, 26))
        to_date = new Date(Date.UTC(current_year, current_month, 25))
    }
    const q = `select pdate,totalhrs,updated_status from attendance where emp_id=? and pdate>=date(?) and pdate<=date(?) order by pdate`
    db.query(q, [emp_id, from_date, to_date], async (err, result) => {
        if (err) {
            //console.log(err)
            return res.status(500).json('error occured!')
        }
        else {
            const find_user_shift_query = `select shift from usermanagement where employee_id = ?`
            const find_user_shift_value = [emp_id]

            const shift_result = await db.promise().query(find_user_shift_query, find_user_shift_value)
            const shift = shift_result[0][0].shift

            const attendanceData = result.filter(data => data.updated_status !== 'CL' && data.updated_status !== 'SL')
            // const hr_list = attendanceData.map(a => a.totalhrs <= 4 ? 0 : a.totalhrs)
            // //const hr_list = result.map(a => a.totalhrs <= 4 ? 0 :a.updated_status==='CL'?0:a.updated_status==='SL'?0: a.totalhrs)
            // console.log('list',hr_list,attendanceData)
            // const totalhr = hr_list.reduce((acc, curr_value) => acc + (Math.trunc(curr_value)), 0)
            // const totalmin = hr_list.reduce((acc, curr_value) => acc + (curr_value % 1).toFixed(2) * 100, 0)
            // const totalShift = hr_list.length * 9 * 60 //in min
            // const totalNonWorked = (hr_list.filter(hr => hr <= 4).length) * 9 * 60
            // const totalWorked = ((totalhr * 60) + totalmin) - (totalShift - totalNonWorked)
            // const hr_bal = (Math.trunc(totalWorked / 60) + (totalWorked % 60) / 100).toFixed(2)
            //console.log('bal_hr', hr_bal)
            //const data = result.reverse()
            //console.log(result)
            const hr_list = attendanceData.filter(data => data.updated_status === 'XX' || data.updated_status === 'XA').map(a => a.totalhrs)
            console.log(hr_list)
            const totalhr = hr_list.reduce((acc, curr_value) => acc + (Math.trunc(curr_value)), 0)
            const totalmin = hr_list.reduce((acc, curr_value) => acc + (curr_value % 1).toFixed(2) * 100, 0)
            const totalShift = hr_list.length * shift * 60 //in min
            const halfDayShift = attendanceData.filter(data => data.updated_status === 'XL' && data.totalhrs >= 4).map(att => att.totalhrs)
            const totalHalfDayShift = halfDayShift.length * 4 * 60
            const totalhrHalfDayShift = halfDayShift.reduce((acc, curr_value) => acc + (Math.trunc(curr_value)), 0)
            const totalminHalfDayShift = halfDayShift.reduce((acc, curr_value) => acc + (curr_value % 1).toFixed(2) * 100, 0)
            //const halfDayShiftWorked = halfDayShift.length*4

            //const abbsent = attendance.filter(att=>)
            const totalHalfDayPresent = ((totalhrHalfDayShift * 60) + totalminHalfDayShift) - totalHalfDayShift
            //console.log('half',totalHalfDayShift,halfDayShift,totalhrHalfDayShift,totalminHalfDayShift)
            console.log('half', totalHalfDayPresent)
            //const totalNonWorked = (hr_list.filter(hr => hr === 0).length) * shift * 60 //
            const totalWorked = ((totalhr * 60) + totalmin + totalHalfDayPresent) - totalShift//(totalShift - totalNonWorked)
            const hr_bal = (Math.trunc(totalWorked / 60) + (totalWorked % 60) / 100).toFixed(2)

            return res.status(200).json({ graphData: result, balance: hr_bal })
        }
    })
}