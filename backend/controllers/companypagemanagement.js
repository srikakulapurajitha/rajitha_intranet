import db from "../config/connectiondb.js";
import { v4 as uuidv4 } from 'uuid';

export const companynames = (req,res) =>{
    const q = `select id, company_name from companymanagement where company_status='active' order by id desc`
    db.query(q,(err,result)=>{
        if(err){
            return res.status(500).json('error occurd!')
        }
        else{
            return res.status(200).json(result)
        }
    })
}

export const addcompanypageholidays =(req,res)=>{
    console.log(req.body)
    const q = 'select * from officeholidays inner join companypagesmanagement on id=pageId where company_name = ? and company_pagename = ? and holidaylist_title=?'
    const check_values = [ req.body.companypagedata.company_name, req.body.companypagedata.company_pagename, req.body.pagedetails.holidaylist_title]
    db.query(q,check_values,(err,result)=>{
        if (err){
            console.log(err)
            return res.status(500).json('error occured!')
            
        }
        else{
            console.log(result)
            if (result.length===0){
                const pageId = uuidv4()
                const insertPageData_query = 'insert into companypagesmanagement values(?)'
                const insertPageData_values = [pageId,req.body.companypagedata.company_name,req.body.companypagedata.company_pagename,req.body.companypagedata.company_pagetype,req.body.companypagedata.company_pagestatus,req.body.companypagedata.companyId]
                db.query(insertPageData_query,[insertPageData_values],(err,result)=>{
                    if(err){
                        console.log(err)
                        return res.status(500).json('error occured!')
                    }
                    else{
                    console.log(result)
                    //res.send('added ')
                    for(let i in req.body.pagedetails.holiday_title){
                        console.log(req.body.pagedetails.holiday_date[i])
                        const insertHolidays_query = 'insert into officeholidays(holidaylist_title, holiday_title, holiday_date, holiday_day,pageID) values(?)'
                        const insertHolidays_values = [req.body.pagedetails.holidaylist_title,req.body.pagedetails.holiday_title[i],req.body.pagedetails.holiday_date[i],req.body.pagedetails.holiday_day[i],pageId]
                        db.query(insertHolidays_query,[insertHolidays_values],(err,result)=>{
                            if(err) return res.status(500).json('error occured!')
                            else{
                                console.log(result)
                                //return res.status(201).json('Data Added Successfully')
                            }
                        })
                        
                    }
                    return res.status(201).json('data added successfully')
                    }
                })

            }
            else{
                return res.status(500).json('holiday list title already exist for given data!')
            }

                    
         }
    })

   //res.send('from addpages')
}

export const addcompanypageaddress = (req,res)=>{
    console.log(req.body)
    const check_query = 'select * from companypagesmanagement where companyId=? and company_pagename=? and company_pagetype=?'
    const check_values = [req.body.companyId,req.body.company_pagename,req.body.company_pagetype]
    db.query(check_query,check_values,async(err,result)=>{
        if(err) return res.status(500).json('error occured!')
        else{
            console.log(result)
            if(result.length===0){
                const pageId = uuidv4()
                const insert_query = 'insert into companypagesmanagement values(?) '
                const insert_values = [pageId,req.body.company_name,req.body.company_pagename,req.body.company_pagetype,req.body.company_pagestatus,req.body.companyId]
                try{
                    await db.promise().query(insert_query,[insert_values])
                    return res.status(201).json('data added successfully')
                }
                catch(err){
                    console.log(err)
                    return res.status(500).json('error occured!')
                }
            }
            else{
                return res.status(500).json('page already exist for given data!')
            }
        }
    })
    //res.send('from address')
}

export const viewcompanypages = (req,res)=>{
    const q = 'select * from companypagesmanagement'
    db.query(q,(err,result)=>{
        if(err) return res.status(500).json('error occured!')
        else res.send(result)
    })

}

export const getcompanypagedata = (req,res) =>{
    console.log(req.body)
    let q;
    let values
    switch (req.body.company_pagetype){
        case 'Holidays':
             q = 'select * from officeholidays where pageId=?'
             values = [req.body.id]
             break
        case 'Address':
            q='select * from companymanagement where id=?'
            values = [req.body.companyId]
            break
    }
    
    db.query(q,values,(err,result)=>{
        if(err) {
            console.log(err)
            return res.status(500).json('error occured!')
        }
        else{
            console.log(result)
            res.send(result)
        }
    })
    
}

export const updatecompanypageholidays=(req,res)=>{
    console.log('res',req.body)
    const q = 'select * from companypagesmanagement inner join officeholidays on id=pageId where company_name=? and company_pagename=? and holidaylist_title!=? and holidaylist_title=?'
    const check_values = [ req.body.compDetails.company_name, req.body.compDetails.company_pagename, req.body.editHolidays.prevHolidayListTitle, req.body.editHolidays.holidaylist_title]
    db.query(q, check_values,(err,result)=>{
        console.log('up',result)
        if(err){
            console.log(err)
            return res.status(500).json('error occured!')
        }
        else{
            if(result.length===0){
                console.log(result)
                const updateCompDataQuery = 'update companypagesmanagement set company_name =?, company_pagename=?,company_pagetype=?,company_pagestatus=?,companyId=? where id=?;'
                const updateCompDataValues = [req.body.compDetails.company_name,req.body.compDetails.company_pagename,req.body.compDetails.company_pagetype,req.body.compDetails.company_pagestatus,req.body.compDetails.companyId,req.body.compDetails.id]
                db.query(updateCompDataQuery,updateCompDataValues,(err,updatecompresult)=>{
                    if(err){
                        console.log(err)
                        return res.status(500).json('error occured!')
                    }
                    else{
                        const delete_holiday_query = ' delete from officeholidays where pageId=? and holidaylist_title =?'
                        const delete_holiday_values = [req.body.editHolidays.pageId, req.body.editHolidays.prevHolidayListTitle]
                        db.query(delete_holiday_query,delete_holiday_values,(err,result)=>{
                            if(err){
                                console.log(err)
                            } 
                            else{
                                console.log(result)
                                for(let i in req.body.editHolidays.holiday_title){
                                        const insertHolidays_query = 'insert into officeholidays(holidaylist_title, holiday_title, holiday_date, holiday_day,pageID) values(?)'
                                        const insertHolidays_values = [req.body.editHolidays.holidaylist_title,req.body.editHolidays.holiday_title[i],new Date(req.body.editHolidays.holiday_date[i]),req.body.editHolidays.holiday_day[i],req.body.editHolidays.pageId]
                                        db.query(insertHolidays_query,[insertHolidays_values],(err,result)=>{
                                            if(err){
                                                console.log(err)
                                            } 
                                            else{
                                                console.log(result)
                                                //return res.status(201).json('Data Added Successfully')
                                            }
                                        })
                                    }                          
                            }
                        })
                    }
                    return res.status(201).json('data updated successfully')
                                
                                
                })
                
               
            }
            else{
                console.log('exist')
                return res.status(500).json('Holiday title already exist for given data!')
            }
            
        }
    })
    
    //res.send('from upate holiday')
}

export const updatecompanypageaddress=(req,res)=>{
    console.log(req.body)
    const check_query = 'select * from companypagesmanagement where companyId=? and company_pagename=? and company_pagetype=? and id!=?'
    const check_values = [req.body.companyId,req.body.company_pagename,req.body.company_pagetype,req.body.id]
    db.query(check_query,check_values,async(err,result)=>{
        if(err) return res.status(500).json('error occured!')
        else{
            console.log(result)
            if(result.length===0){
                
                const updateCompDataQuery = 'update companypagesmanagement set company_name =?, company_pagename=?,company_pagetype=?,company_pagestatus=?,companyId=? where id=?;'
                const updateCompDataValues = [req.body.company_name,req.body.company_pagename,req.body.company_pagetype,req.body.company_pagestatus,req.body.companyId,req.body.id]
                db.query(updateCompDataQuery,updateCompDataValues,(err,updatecompresult)=>{
                    if(err){
                        console.log(err)
                        return res.status(500).json('error occured!')
                    }
                    else{
                        return res.status(200).json('Data updated Successfully!')
                    }
                })
            }
            else{
                return res.status(500).json('Company page name already exist!')
            }

        }})
    //res.send('from edit addr')
}

export const deletecompanypages = (req,res) =>{
    console.log(req.body)
    
    const q='delete from companypagesmanagement where id in (?)'
    db.query(q,[req.body.id],(err,result)=>{
        
        if(err) {
            console.log(err)
            return res.status(500).json(err)
        }
        else{
            console.log(result)
            return res.status(200).json('Company Deleted Successfully')
        }
    })
    //res.send('ok')
}