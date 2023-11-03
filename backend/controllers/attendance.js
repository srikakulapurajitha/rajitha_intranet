import multer from "multer"
import decompress from "decompress";
import fs from 'fs'
import reader from "xlsx";
import db from "../config/connectiondb.js";
import e from "express";

let uploadedFileName;

function uploadExcelData(name) {
    //console.log(name)
    const ProjectPath = process.cwd()

    const zip = decompress(ProjectPath + "\\uploads\\" + name, ProjectPath + "\\uploads\\ExtractedFiles\\")
        .then((files) => {
            let startReadFile

            if (files.length === 0) {
                //console.log('len 0')
                fs.rmSync(ProjectPath + "\\uploads\\ExtractedFiles\\" + (name).slice(0, name.lastIndexOf('.')), { recursive: true, force: true })
                fs.unlinkSync(ProjectPath + "\\uploads\\" + name)
                //fs.unlink(ProjectPath+"\\uploads\\ExtractedFiles\\"+name)
                return ('zip not containing files!')
            }
            else if (files.length == 1 && files[0].type === 'directory') {
                //console.log('len 1 dir')
                fs.rmSync(ProjectPath + "\\uploads\\ExtractedFiles\\" + (name).slice(0, name.lastIndexOf('.')), { recursive: true, force: true })
                fs.unlinkSync(ProjectPath + "\\uploads\\" + name)
                return ('zip not containing files!')
            }
            else {

                //console.log(files[1])
                //console.log((files[1].path).slice(files[1].path.lastIndexOf('.'),))

                if (files[0].type === 'directory') {
                    console.log('dir')
                    if ((files[1].path).slice(files[1].path.lastIndexOf('.'),) !== '.xlsx') {
                        fs.rmSync(ProjectPath + "\\uploads\\ExtractedFiles\\" + (name).slice(0, name.lastIndexOf('.')), { recursive: true, force: true })
                        fs.unlinkSync(ProjectPath + "\\uploads\\" + name)
                        return ('zip not containing excel sheets')
                    }
                    else {

                        startReadFile = 1
                    }
                }
                else {
                    // console.log('file type')
                    // console.log((files[1].path).slice(files[1].path.lastIndexOf('.'),))
                    // console.log((name).slice(0,name.lastIndexOf('.')))
                    if ((files[0].path).slice(files[0].path.lastIndexOf('.'),) !== '.xlsx') {
                        fs.rmSync(ProjectPath + "\\uploads\\ExtractedFiles\\" + (name).slice(0, name.lastIndexOf('.')), { recursive: true, force: true })
                        fs.unlinkSync(ProjectPath + "\\uploads\\" + name)
                        return ('zip not containing excel sheets')
                    }
                    else {
                        startReadFile = 0
                    }
                }
            }
            //console.log(files[1])
            // console.log(files[0].type)
            files.slice(startReadFile,).forEach((filedata) => {
                const filepath = ProjectPath + "\\uploads\\ExtractedFiles\\" + filedata.path.replace('/', '\\')
                //console.log(filepath)
                const readFile = reader.readFile(filepath)
                let data = []

                const sheets = readFile.SheetNames
                //console.log(sheets)
                for (let i = 0; i < sheets.length; i++) {
                    const temp = reader.utils.sheet_to_json(
                        readFile.Sheets[readFile.SheetNames[i]])
                    temp.forEach((res) => {
                        if (!res.Emp_code) return "error occured check uploaded files"
                        //let pdate = (new Date(Date.UTC(0, 0, res.PDate - 1)))
                        res.PDate = new Date(Date.UTC(0, 0, res.PDate - 1))
                        //console.log(pdate.getDate(),``)
                        try {
                            db.query('select * from attendance where emp_id=? and pdate=date(?)', [res.Emp_code, res.PDate], async (err, result) => {
                                if (err) return ('error occured!')
                                //console.log(result)
                                let status ='AA'
                                if(['WH','HH'].includes(res.Status)){
                                    status=res.Status
                                }

                                try {
                                    if (result.length === 0) {
                                        const q = 'insert into attendance(emp_id,pdate,firstin,lastout,status,totalhrs,updated_status) values (?,date(?),?,?,?,?,?)'
                                        const values = [res.Emp_code, res.PDate, res.firstin, res.LastOut, res.Status, res.totlhrs,status]
                                        await db.promise().query(q, values)
                                    }
                                    else {
                                        console.log('updating')
                                        const q = 'update attendance set emp_id=?, pdate=date(?),firstin=?,lastout=?,status=?,totalhrs=?,updated_status=? where emp_id=? and pdate= date(?)'
                                        const values = [res.Emp_code, res.PDate, res.firstin, res.LastOut, res.Status, res.totlhrs,status, res.Emp_code, res.PDate,status]
                                        await db.promise().query(q, values)
                                    }
                                }
                                catch(err) {
                                    console.log(err)
                                    return ('error with excel data please check excel file!')
                                }

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
                                console.log('emp_id',res.Emp_code)
                                const check_status_query = `select * from attendance where pdate>=date(?) and pdate<=date(?) and emp_id = ?`
                                db.query(check_status_query, [from_date, to_date, res.Emp_code], (err, result) => {
                                    if (err) console.log(err)
                                    else {

                                        console.log('atte:', result)
                                        const hr_list = result.map(a => a.totalhrs)
                                        console.log(hr_list)
                                        const totalhr = hr_list.reduce((acc, curr_value) => acc + (Math.trunc(curr_value)), 0)
                                        const totalmin = hr_list.reduce((acc, curr_value) => acc + (curr_value % 1).toFixed(2) * 100, 0)
                                        const totalShift = hr_list.length * 9 * 60 //in min
                                        const totalNonWorked = (hr_list.filter(hr => hr === 0).length) * 9 * 60
                                        const totalWorked = ((totalhr * 60) + totalmin) - (totalShift - totalNonWorked)
                                        const hr_bal = (Math.trunc(totalWorked / 60) + (totalWorked % 60) / 100).toFixed(2)
                                        console.log(hr_bal)
                                        let update_status_query;
                                        if (Number(hr_bal) < 0) {
                                            update_status_query = `update attendance set updated_status = 'XA' where  updated_status !='XX' and updated_status ='AA' and status !='AA'  and pdate>=date(?) and pdate<=date(?) and emp_id = ? `
                                        }
                                        else {

                                            update_status_query = `update attendance set updated_status = 'XX' where updated_status !='XX' and updated_status in ('AA','XA') and status !='AA' and pdate>=date(?) and pdate<=date(?) and emp_id = ? `
                                        }
                                        try{
                                            db.promise().query(update_status_query, [from_date, to_date, res.Emp_code])
                                        }
                                        catch(err){
                                            console.log(err)
                                        }
                                        
                                    }


                                })



                                //     db.query('select balance_hr from attendance where emp_id=1 order by pdate desc limit 1',[],async(error,response)=>{
                                //         if (error) return ('error occured!')
                                //         else{
                                //             console.log(response)
                                //             let bal_hr = 0
                                //             if (response.length !==0){
                                //                 bal_hr = response[0].balance_hr
                                //             }
                                //             console.log(bal_hr,res.totlhrs)
                                //             if(res.totlhrs>9){
                                //                 const bal_min = (Math.trunc(bal_hr)*60)+(bal_hr%1).toFixed(2)*100 + (((Math.trunc(res.totlhrs)-9)*60)+ (res.totlhrs %1).toFixed(2)*100)
                                //                 bal_hr = parseFloat(Math.trunc(bal_min/60)+(bal_min%60)/100).toFixed(2)
                                //                 console.log(bal_min,bal_hr)
                                //             }
                                //             else if(res.totlhrs<9 && res.totlhrs!=0){
                                //                 console.log((Math.trunc(bal_hr)*60)+(bal_hr%1).toFixed(2)*100,(((9-(Math.trunc(res.totlhrs)))*60) -(res.totlhrs %1).toFixed(2)*100 ))
                                //                 const bal_min = ((Math.trunc(bal_hr)*60)+(bal_hr%1).toFixed(2)*100) - (((9-(Math.trunc(res.totlhrs)))*60) -(res.totlhrs %1).toFixed(2)*100 )
                                //                 bal_hr = parseFloat(Math.trunc(bal_min/60)+(bal_min%60)/100).toFixed(2)
                                //                 console.log(bal_min,bal_hr)
                                //             }
                                //             console.log(bal_hr,'bal')



                                //         }
                                //     })

                                // }

                                //console.log(result)
                            })
                        }
                        catch (err) {
                            console.log(err)
                            return ('error occured!')
                        }

                        data.push(res)



                        // Printing data
                        //console.log(data)


                    })

                    //console.log('uploaded')
                }
            })
            return ('file uploaded succefully')


        })
        .catch(error => {
            console.log(error)
            console.log(ProjectPath + "\\uploads\\" + name)
            fs.rmSync(ProjectPath + "\\uploads\\ExtractedFiles\\" + (name).slice(0, name.lastIndexOf('.')), { recursive: true, force: true })
            fs.unlinkSync(ProjectPath + "\\uploads\\" + name)
            return (
                'error occured check the uploaded file!'
            )
        })
    return (zip)
}

const storege = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
        console.log(file.originalname)
        uploadedFileName = file.originalname
        cb(null, file.originalname)

        //     setTimeout(()=>{
        //     const reseponce = uploadExcelData(file.originalname)

        // },2000)
    },
})


export const uploadStorage = multer({ storage: storege })

export const UploadFile = async (req, res) => {

    //console.log(storege);
    const response = await uploadExcelData(uploadedFileName)

    console.log('up:', response)
    if (response === 'file uploaded succefully') {
        res.status(200).json(response)
    }
    else {
        res.status(500).json(response)
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
    console.log(req.body)
    const { fromDate, toDate, emp_id } = req.body
    let q, v;
    if (emp_id !== '') {
        q = `select * from attendance where pdate >=? and pdate <=? and emp_id=?`
        v = [fromDate, toDate, emp_id]
        //console.log(emp_id)
    }
    else {
        q = `select * from attendance where pdate >=? and pdate <=?`
        v = [fromDate, toDate]
        //console.log(emp_id)
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
    console.log(req.body)
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
    const q = `select * from attendance where emp_id=? and pdate>=date(?) and pdate<=date(?)`
    const { emp_id } = req.body
    db.query(q, [emp_id, from_date, to_date], (err, result) => {
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

export const filteruserattendance = (req, res) => {
    console.log(req.body)
    const { fromDate, toDate, emp_id } = req.body
    const q = `select * from attendance where pdate >=? and pdate <=? and emp_id=?`
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
    const q = `select pdate,totalhrs from attendance where emp_id=? and pdate>=date(?) and pdate<=date(?)`
    db.query(q, [emp_id, from_date, to_date], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json('error occured!')
        }
        else {
            const hr_list = result.map(a => a.totalhrs)
            console.log(hr_list)
            const totalhr = hr_list.reduce((acc, curr_value) => acc + (Math.trunc(curr_value)), 0)
            const totalmin = hr_list.reduce((acc, curr_value) => acc + (curr_value % 1).toFixed(2) * 100, 0)
            const totalShift = hr_list.length * 9 * 60 //in min
            const totalNonWorked = (hr_list.filter(hr => hr === 0).length) * 9 * 60
            const totalWorked = ((totalhr * 60) + totalmin) - (totalShift - totalNonWorked)
            const hr_bal = (Math.trunc(totalWorked / 60) + (totalWorked % 60) / 100).toFixed(2)
            console.log('bal_hr', hr_bal)
            //const data = result.reverse()
            console.log(result)
            return res.status(200).json({ graphData: result, balance: hr_bal })
        }
    })
}