import db from "../config/connectiondb.js";
import { v4 as uuidv4 } from 'uuid';

import 'dotenv/config'
import cloudinary from "../config/cloudinaryconfig.js";

export const companynames = async (req, res) => {
    console.log(req.cookies)
    // try {

        // if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
            const q = `select id, company_name from companymanagement where company_status='active' order by id desc`
            db.query(q, (err, result) => {
                if (err) {
                    return res.status(500).json('not able to fetch company names!')
                }
                else {
                    return res.status(200).json(result)
                }
            })
    //     }
    //     else {
    //         return res.status(401).json('Unauthorized User')
    //     }
    // }
    // catch {
    //     return res.status(500).json('not able to fetch company names!')
    // }

}

export const addcompanypageholidays = (req, res) => {
    console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const q = 'select * from officeholidays inner join companypagesmanagement on id=pageId where company_name = ? and company_pagename = ? and holidaylist_title=? and department rlike ?'
        const check_values = [req.body.companypagedata.company_name, req.body.companypagedata.company_pagename, req.body.pagedetails.holidaylist_title, req.body.pagedetails.department.join('|')]
        db.query(q, check_values, async (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json('error occured!')

            }
            else {
                console.log(result)
                if (result.length === 0) {
                    const pageId = uuidv4()
                    const insertPageData_query = 'insert into companypagesmanagement(id,company_name,company_pagename,company_pagetype,company_pagestatus,companyId) values(?)'
                    const insertPageData_values = [pageId, req.body.companypagedata.company_name, req.body.companypagedata.company_pagename, req.body.companypagedata.company_pagetype, req.body.companypagedata.company_pagestatus, req.body.companypagedata.companyId]
                    try {
                        await db.promise().query(insertPageData_query, [insertPageData_values])
                        for (let i in req.body.pagedetails.holiday_title) {
                            console.log(req.body.pagedetails.holiday_date[i])
                            const insertHolidays_query = 'insert into officeholidays(department,holidaylist_title, holiday_title, holiday_date, holiday_day,pageID) values(?)'
                            const insertHolidays_values = [req.body.pagedetails.department.join(','), req.body.pagedetails.holidaylist_title, req.body.pagedetails.holiday_title[i], req.body.pagedetails.holiday_date[i], req.body.pagedetails.holiday_day[i], pageId]
                            await db.promise().query(insertHolidays_query, [insertHolidays_values])
                        }

                        return res.status(201).json('Compnay Page added successfully')


                    }
                    catch (err) {
                        console.log(err)

                        res.status(500).json('error occured!')

                    }
                }
                else {
                    return res.status(500).json('holiday list title already exist for given data!')
                }
            }
        })
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }


}


export const addcompanypageaddress = (req, res) => {
    console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const check_query = 'select * from companypagesmanagement where companyId=? and company_pagename=? and company_pagetype=?'
        const check_values = [req.body.companyId, req.body.company_pagename, req.body.company_pagetype]
        db.query(check_query, check_values, async (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                console.log(result)
                if (result.length === 0) {
                    const pageId = uuidv4()
                    const insert_query = 'insert into companypagesmanagement(id,company_name,company_pagename,company_pagetype,company_pagestatus,companyId) values(?) '
                    const insert_values = [pageId, req.body.company_name, req.body.company_pagename, req.body.company_pagetype, req.body.company_pagestatus, req.body.companyId]
                    try {
                        await db.promise().query(insert_query, [insert_values])
                        return res.status(201).json('data added successfully')
                    }
                    catch (err) {
                        console.log(err)
                        return res.status(500).json('error occured!')
                    }
                }
                else {
                    return res.status(500).json('page already exist for given data!')
                }
            }
        })
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }

    //res.send('from address')
}

export const uploadchart = (req, res) => {
    console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const { compData, img } = req.body
        const check_query = 'select * from companypagesmanagement where companyId=? and company_pagename=? and company_pagetype=?'
        const check_values = [compData.companyId, compData.company_pagename, compData.company_pagetype]
        db.query(check_query, check_values, async (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                console.log(result)
                if (result.length === 0) {

                    const pageId = uuidv4()
                    const insert_query_compPageManagement = 'insert into companypagesmanagement(id,company_name,company_pagename,company_pagetype,company_pagestatus,companyId) values(?) '
                    const insert_values_compPageManagement = [pageId, compData.company_name, compData.company_pagename, compData.company_pagetype, compData.company_pagestatus, compData.companyId]
                    const insert_query_officeChart = `insert into officecharts(chart_image,pageId) values(?)`

                    try {
                        const img_res = await cloudinary.uploader.upload(img, { upload_preset: process.env.UPLOAD_PRESET_Charts })
                        const chart_img = img_res.url
                        await db.promise().query(insert_query_compPageManagement, [insert_values_compPageManagement])
                        await db.promise().query(insert_query_officeChart, [[chart_img, pageId]])
                        return res.status(201).json('data added successfully')
                    }
                    catch (err) {
                        console.log(err)
                        return res.status(500).json('error occured!')
                    }
                }
                else {
                    return res.status(500).json('page already exist for given data!')
                }
            }
        })
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }


    //res.send('ok')
}



export const viewcompanypages = (req, res) => {
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const q = 'select * from companypagesmanagement order by no desc'
        db.query(q, (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else res.send(result)
        })

    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }

}


export const getcompanypagedata = (req, res) => {
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        console.log(req.body)
        let q;
        let values
        switch (req.body.company_pagetype) {
            case 'Holidays':
                q = 'select * from officeholidays where pageId=? order by holiday_date '
                values = [req.body.id]
                break
            case 'Address':
                q = 'select * from companymanagement where id=?'
                values = [req.body.companyId]
                break
            case 'Chart':
                q = `select * from officecharts where pageId = ?`
                values = [req.body.id]

        }

        db.query(q, values, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json('error occured!')
            }
            else {
                console.log(result)
                res.send(result)
            }
        })
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }


}

export const updatecompanypageholidays = (req, res) => {
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        console.log('res', req.body)
        const q = 'select * from companypagesmanagement inner join officeholidays on id=pageId where company_name=? and company_pagename=? and holidaylist_title!=? and holidaylist_title=? and department rlike ?'
        const check_values = [req.body.compDetails.company_name, req.body.compDetails.company_pagename, req.body.editHolidays.prevHolidayListTitle, req.body.editHolidays.holidaylist_title, req.body.editHolidays.department.join('|')]
        db.query(q, check_values, async (err, result) => {
            console.log('up', result)
            if (err) {
                console.log(err)
                return res.status(500).json('error occured!')
            }
            else {
                if (result.length === 0) {
                    try {
                        const updateCompDataQuery = 'update companypagesmanagement set company_name =?, company_pagename=?,company_pagetype=?,company_pagestatus=?,companyId=? where id=?;'
                        const updateCompDataValues = [req.body.compDetails.company_name, req.body.compDetails.company_pagename, req.body.compDetails.company_pagetype, req.body.compDetails.company_pagestatus, req.body.compDetails.companyId, req.body.compDetails.id]
                        await db.promise().query(updateCompDataQuery, updateCompDataValues)
                        const delete_holiday_query = ' delete from officeholidays where pageId=? and holidaylist_title =? '
                        const delete_holiday_values = [req.body.editHolidays.pageId, req.body.editHolidays.prevHolidayListTitle]
                        await db.promise().query(delete_holiday_query, delete_holiday_values)
                        for (let i in req.body.editHolidays.holiday_title) {
                            const insertHolidays_query = 'insert into officeholidays(department, holidaylist_title, holiday_title, holiday_date, holiday_day,pageID) values(?)'
                            const insertHolidays_values = [req.body.editHolidays.department.join(','), req.body.editHolidays.holidaylist_title, req.body.editHolidays.holiday_title[i], new Date(req.body.editHolidays.holiday_date[i]), req.body.editHolidays.holiday_day[i], req.body.editHolidays.pageId]
                            await db.promise().query(insertHolidays_query, [insertHolidays_values])
                        }
                        return res.status(201).json('Data updated successfully')

                    }
                    catch {
                        return res.status(500).json('error occured!')
                    }

                }
                else {
                    console.log('exist')
                    return res.status(500).json('Holiday title already exist for given data!')
                }

            }
        })

    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }

    //res.send('from upate holiday')
}

export const updatecompanypageaddress = (req, res) => {
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        console.log(req.body)
        const check_query = 'select * from companypagesmanagement where companyId=? and company_pagename=? and company_pagetype=? and id!=?'
        const check_values = [req.body.companyId, req.body.company_pagename, req.body.company_pagetype, req.body.id]
        db.query(check_query, check_values, async (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                console.log(result)
                if (result.length === 0) {

                    const updateCompDataQuery = 'update companypagesmanagement set company_name =?, company_pagename=?,company_pagetype=?,company_pagestatus=?,companyId=? where id=?;'
                    const updateCompDataValues = [req.body.company_name, req.body.company_pagename, req.body.company_pagetype, req.body.company_pagestatus, req.body.companyId, req.body.id]
                    try{
                        await db.promise().query(updateCompDataQuery, updateCompDataValues)
                        return res.status(200).json('Data updated Successfully!')
                    }
                    catch{
                        return res.status(500).json('error occured!')
                    }
                  
                }
                else {
                    return res.status(500).json('Company page name already exist!')
                }

            }
        })
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }

    //res.send('from edit addr')
}

export const updatecompanypagechart = (req, res) => {
    //console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const { compDetails, image } = req.body

        try {
            const check_query = 'select * from companypagesmanagement where companyId=? and company_pagename=? and company_pagetype=? and id!=?'
            const check_values = [compDetails.companyId, compDetails.company_pagename, compDetails.company_pagetype, compDetails.id]
            db.query(check_query, check_values, async (err, result) => {
                if (err) return res.status(500).json('error occured!')
                else {
                    console.log(result)
                    if (result.length === 0) {
                        
                        const updateCompDataQuery = 'update companypagesmanagement set company_name =?, company_pagename=?,company_pagetype=?,company_pagestatus=?,companyId=? where id=?;'
                        const updateCompDataValues = [compDetails.company_name, compDetails.company_pagename, compDetails.company_pagetype, compDetails.company_pagestatus, compDetails.companyId, compDetails.id]
                        await db.promise().query(updateCompDataQuery, updateCompDataValues)
                        let chart_img = image.newImg;
                        if (image.prevImg !== image.newImg && image.newImg!=='') {
                            const url = image.prevImg.slice(0, image.prevImg.lastIndexOf('/'))
                            const img_name = image.prevImg.slice(image.prevImg.lastIndexOf('/'), image.prevImg.lastIndexOf('.'))
                            const path = url.slice(url.lastIndexOf('/') + 1,) + img_name
                            await cloudinary.uploader.destroy(path)
                            const img_res = await cloudinary.uploader.upload(image.newImg, { upload_preset: process.env.UPLOAD_PRESET_Charts })
                            chart_img = img_res.url
                            
                            
                        }
                        const updateChartDataQuery = `update officecharts set chart_image=? where pageId=?`
                            await db.promise().query(updateChartDataQuery, [chart_img, compDetails.id])

                        return res.status(201).json('data updated successfully')
                    }
                    else {
                        return res.status(400).json('Page name already exist!')
                    }
                }
            })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json('error occured!')
        }
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }





}

export const deletecompanypages = (req, res) => {
    console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const q = 'delete from companypagesmanagement where id in (?)'
        db.query(q, [req.body.id], (err, result) => {

            if (err) {
                console.log(err)
                return res.status(500).json('error occured!')
            }
            else {
                console.log(result)
                return res.status(200).json('Company Page Deleted Successfully')
            }
        })
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }


    //res.send('ok')
}


//----------------------------------------------------------------teams-----------------------------------------------------

export const showcompanypages = (req, res) => {
    const q = `select * from companypagesmanagement where company_pagestatus='active'`
    db.query(q, (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else res.send(result)
    })

}

export const showcompanypagedata = (req, res) => {
    const { id, companyId, company_pagetype } = req.body
    

    console.log(req.body)
    let q;
    let values
    switch (company_pagetype) {
        case 'Holidays':
            q = 'select * from officeholidays where pageId in (?) order by holiday_date'
            values = [id]
            break
        case 'Address':
            q = 'select * from companymanagement where id=?'
            values = [companyId]
            break
        case 'Chart':
            q = `select * from officecharts where pageId=?`
            values = [id]

    }
    //res.send('ok')
    db.query(q, values, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json('error occured!')
        }
        else {
            console.log(result)
            res.send(result)
        }
    })
}