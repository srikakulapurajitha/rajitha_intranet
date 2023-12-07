import db from "../config/connectiondb.js";


export const getreportinguser = (req, res) => {
    console.log(req.body)
    const { searchBy, field } = req.body
    let search_query, search_value;
    if (searchBy === 'name') {
        search_query = `select profile_pic,employee_id, concat(first_name,' ',last_name) as fullname,designation from usermanagement where status='active' and concat(first_name,' ',last_name) like ? group by employee_id;`
        search_value = ['%' + field + '%']
    }
    else if (searchBy === 'employee_id') {
        search_query = `select profile_pic,employee_id, concat(first_name,' ',last_name) as fullname,designation from usermanagement where status='active' and employee_id=? group by employee_id;`
        search_value = [field]
    }
    else {
        search_query = `select profile_pic,employee_id, concat(first_name,' ',last_name) as fullname,designation from usermanagement where status='active' and email=? group by employee_id;`
        search_value = [field]
    }
    db.query(search_query, search_value, (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            console.log(result)
            if (result.length === 0) {
                return res.status(406).json('No record found!')
            }
            else {
                return res.status(200).json(result)
            }
        }
    })
    //res.send('ok')
}

export const addreportingstructure = (req, res) => {
    console.log(req.body)
    const { head, users } = req.body
    //res.send('ok')
    const check_query = `select * from reportingstructure where reporting_head =? or users in (?) or (select reporting_head from reportingstructure where users=?) in (?)`
    const check_value = [head, users,head,users]
    db.query(check_query, check_value, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json('error occured!')
        }
        else {
            if (result.length === 0) {
                users.forEach(async (element) => {
                    const q = `insert into reportingstructure(reporting_head, users) values(?)`
                    const v = [head, element]
                    try {
                        await db.promise().query(q, [v])
                    }
                    catch (err) {
                        console.log(err)//('error occured!')
                        return res.status(500).json('error occured!')
                    }
                });
                return res.status(200).json('Reporting Structure Added Succefully')

            }
            else {
                return res.status(406).json('cheack your reporting stucture and change users which is not belongs to other reporting structure and must not add reporting head in users')
            }
        }
    })
}

export const getreportingheaddata = (req, res) => {
    const q = `select distinct(reporting_head), profile_pic, concat(first_name,' ',last_name) as fullname,employee_id,designation from reportingstructure  inner join usermanagement on employee_id = reporting_head; `
    db.query(q, (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            console.log(result)
            return res.status(200).json(result)
        }
    })
}

export const updatereportingstructure = (req, res) => {
    console.log(req.body)
    const { prevHead, head, users } = req.body
    //res.send('ok')
    if (prevHead === head) {
        const check_query = `select * from reportingstructure where reporting_head !=? and users in (?) or (select reporting_head from reportingstructure where users=?) in (?)`
        const check_value = [head, users,head, users]
        db.query(check_query, check_value, async(err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json('error occured!')
            }
            else {
                if (result.length === 0) {
                    const delete_record  = `delete from reportingstructure where reporting_head=?`
                    await db.promise().query(delete_record,[prevHead])
                    users.forEach(async (element) => {
                        console.log(element)
                        const q = `insert into reportingstructure(reporting_head, users) values(?)`
                        const v = [head, element]
                        try {
                            await db.promise().query(q, [v])
                        }
                        catch (err) {
                            console.log(err)//('error occured!')
                            return res.status(500).json('error occured!')
                        }
                    });
                    return res.status(200).json('Reporting Structure Added Succefully')
                }
                else {
                    return res.status(500).json('cheack your reporting stucture and change users which is not belongs to other reporting structure and must not add reporting head in users')
                }
               
            }
        })

    }
    else {
        const check_reporting_head = `select * from reportingstructure where reporting_head=?`
        db.query(check_reporting_head, [head], (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json('error occured!')
            }
            else {
                console.log('prev', result)
                if (result.length === 0) {
                    const check_query = `select * from reportingstructure where reporting_head !=? and users in (?)`
                    const check_value = [prevHead, users]
                    db.query(check_query, check_value, async(err, result) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).json('error occured!')
                        }
                        else {
                            if (result.length === 0) {
                                const delete_record  = `delete from reportingstructure where reporting_head=?`
                                await db.promise().query(delete_record,[prevHead])
                               
                                users.forEach(async (element) => {
                                    console.log(element)
                                    const q = `insert into reportingstructure(reporting_head, users) values(?)`
                                    const v = [head, element]
                                    try {
                                        await db.promise().query(q, [v])
                                    }
                                    catch (err) {
                                        console.log(err)//('error occured!')
                                        return res.status(500).json('error occured!')
                                    }
                                });
                                return res.status(200).json('Reporting Structure Added Succefully')
                            }
                            else {
                                return res.status(500).json('some users already belong to other reporting structure remove them!')
                            }
                           
                        }
                    })
                }
                else {
                    return res.status(406).json('Reporting head already exists!')
                }
                //console.log(result)
            }
        })




    }


}

export const deletereportingstructure = async(req,res)=>{
    console.log(req.body)
    const delete_query = `delete from reportingstructure where reporting_head in (?)`
    const delete_value = [req.body.head]
    try{
        await db.promise().query(delete_query,delete_value)
        return res.status(200).json('reporting structure deleted succefully')
    }
    catch{
        return res.status(500).json('error occured!')
    }
    
}



export const getreportingstructuredata = (req, res) => {
    // const q = `select distinct(reporting_head), profile_pic, concat(first_name,' ',last_name) as fullname,designation from reportingstructure  inner join usermanagement on employee_id = reporting_head; `
    // db.query(q,(err,result)=>{
    //     if (err) return res.status(500).json('error occured!')
    //     else{
    //         console.log(result)
    //         res.status(200).json(result)            
    //     }
    // })
}

export const editreportingstructuredata = (req, res) => {
    console.log(req.body)
    const q = `select  profile_pic, concat(first_name,' ',last_name) as fullname,employee_id,designation from reportingstructure  inner join usermanagement on employee_id = users where reporting_head=?; `
    db.query(q, [req.body.head], (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            console.log(result)
            res.status(200).json(result)
        }
    })

}