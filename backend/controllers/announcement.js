import db from "../config/connectiondb.js"
import { basictransporter } from "../config/emailconfig.js"

export const addannouncement = (req, res) => {
    console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const { companyId, companyName, department, title, description, from_date, to_date, notify } = req.body
        const check_query = `select * from announcement where companyId=? and department rlike ? and  title=? and from_date=? and to_date=? `
        const check_values = [companyId, department.join('|'), title, from_date, to_date]
        db.query(check_query, check_values, (err, result) => {
            if (err) {
                console.log('error0', err)
                return res.status(500).json('error occured!')
            }
            else {
                if (result.length === 0) {
                    const user_select_query = `select email from usermanagement where company_name=? and department in ?`
                    const user_select_values = [companyName, [department]]
                    db.query(user_select_query, user_select_values, async (selectError, selectResult) => {
                        if (selectError) {
                            console.log('error2', selectError)
                            return res.status(500).json('error occured!')
                        }
                        else {
                            console.log(selectResult)
                            const insert_query = `insert into announcement(company_name, department, title, description, from_date ,to_date, notify, companyId) values(?)`
                            const insert_value = [companyName, department.join(','), title, description, from_date, to_date, notify, companyId]
                            try {
                                await db.promise().query(insert_query, [insert_value])
                                if (selectResult.length !== 0 && notify === 'yes') {
                                    const emails = selectResult.map(user => user.email)
                                    const mailDetails = {
                                        from: '"Brightcomgroup" <akashdandge100@gmail.com>',
                                        to: emails,
                                        subject: `Announcement: ` + title,
                                        text: description


                                    }
                                    basictransporter.sendMail(mailDetails, (err, info) => {
                                        if (err) {
                                            console.log(err)
                                            return res.status(500).json('Announcement added but mail service not working contact admin!')
                                        }
                                        else {
                                            console.log(info)
                                            return res.status(200).json('Mail sended & Announcement added successfully')
                                        }

                                    })

                                }
                                else {
                                    return res.status(200).json('Announcement added successfully')
                                }

                            }
                            catch (err) {
                                //console.log('error1', err.name)
                                return res.status(500).json('error occured!')
                            }



                        }

                    })

                }
                else {
                    return res.status(502).json('Annoucement already exists!')
                }
            }
            //console.log(result)
        })
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }

    //res.send('ok')
}

export const viewannouncement = (req, res) => {
    const q = `select * from announcement order by id desc`
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        db.query(q, (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                return res.status(200).json(result)
            }
        })
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }
}

export const updateannouncement = (req, res) => {
    //console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const { id, company_name, department, title, description, from_date, to_date, notify, companyId, } = req.body
        const check_query = `select * from announcement where department rlike ? and title=? and from_date=? and to_date=? and companyId=? and id!=? `
        const check_values = [department.join('|'), title, from_date, to_date, companyId, id]
        db.query(check_query, check_values, async (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json('error occured!')
            }
            else {
                //console.log(result)
                if (result.length === 0) {
                    const user_select_query = `select email from usermanagement where company_name=? and department in ?`
                    const user_select_values = [company_name, [department]]
                    db.query(user_select_query, user_select_values, async (selectError, selectResult) => {
                        if (selectError) {
                            console.log('error2', selectError)
                            return res.status(500).json('error occured!')
                        }
                        else {
                            const update_query = `update announcement set company_name=?, department=?, title=?, description=?, from_date=?, to_date=?, notify=?, companyId=? where id=?`
                            const update_value = [company_name, department.join(','), title, description, from_date, to_date, notify, companyId, id]
                            try {
                                console.log('users', selectResult)
                                await db.promise().query(update_query, update_value)
                                if (selectResult.length !== 0 && notify === 'yes') {
                                    const emails = selectResult.map(user => user.email)
                                    const mailDetails = {
                                        from: '"Brightcomgroup" <akashdandge100@gmail.com>',
                                        to: emails,
                                        subject: `Announcement(Edited): ` + title,
                                        text: description


                                    }
                                    basictransporter.sendMail(mailDetails, (err, info) => {
                                        if (err) {
                                            console.log(err)
                                            return res.status(500).json('Announcement updated but mail service not working contact admin!')
                                        }
                                        else {
                                            console.log(info)
                                            return res.status(200).json('Mail sended & Announcement updated successfully')
                                        }

                                    })

                                }
                                else {
                                    return res.status(200).json('Announcement updated successfully')
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
                    return res.status(502).json('Annoucement already exists!')
                }
            }
            //console.log(result)
        })
    }

    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }

    //res.status(500).json('ok')
}

export const deleteannouncement = async (req, res) => {
    console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const q = 'delete from announcement where id in (?)'
        try {
            await db.promise().query(q, [req.body.id])
            return res.status(200).json('Announcement Deleted Successfully')
        }
        catch {
            return res.status(500).json('error occured!')
        }
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }
}


//Notice

export const notice = (req, res) => {
    console.log('body',req.body)
    if (req.checkAuth.isAuth) {
        const q = `select * from announcement where company_name =? and department rlike ? and to_date>=? order by to_date`
        const values = [req.body.company_name, req.body.department, req.body.date]
        db.query(q, values, (err, result) => {
            //console.log(err)
            console.log('ann', result)
            if (err) res.status(500).json('error occured!')
            else {
                return res.status(200).json(result)
            }

        })
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }

    //res.send('ok')
}