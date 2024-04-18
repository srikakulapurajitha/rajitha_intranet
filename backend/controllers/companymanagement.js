import db from "../config/connectiondb.js"
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import fs from "fs"
import multer from "multer";

const storege = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder_path = `public/companyLogos/`
        if (!fs.existsSync(path)) {
            fs.mkdirSync(folder_path, { recursive: true });
            cb(null, folder_path)
        }
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    },
})

export const uploadStorage = multer({ storage: storege })

export const addcompany = (req, res) => {
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const { companyName, companyEmail, companyAddress, companyWebsite, companyContactNo, companyStatus } = JSON.parse(req.body.addComData)
        console.log(req.file)

        const companyId = uuidv4()
        let logoPath
        if (req.file === undefined) {
            logoPath = ''
        }
        else {
            logoPath = req.file.path
            logoPath = logoPath.slice(logoPath.indexOf('\\'))
            console.log(logoPath)
        }
        db.query('select * from companymanagement where company_name=?', companyName, async (err, result) => {
            console.log('res', result)
            if (err) {
                console.log(err)
                return res.status(500).json('error occured try again!')
            }
            else {
                if (result.length === 0) {
                    const q = 'insert into companymanagement(id,company_logo,company_name,company_email,company_address,company_website,company_contact_no,company_status) values(?)'
                    const values = [companyId, logoPath, companyName, companyEmail, companyAddress, companyWebsite, companyContactNo, companyStatus]
                    try {
                        await db.promise().query(q, [values])
                        return res.status(200).json('company added successfully')

                    }
                    catch (err) {
                        console.log(err)
                        return res.status(500).json('error occured try again!')
                    }

                }
                else {
                    return res.status(406).json('company name already exist!')
                }
            }

        })
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }


}

export const viewcompany = (req, res) => {

    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const q = 'select * from companymanagement order by serial_no desc'
        db.query(q, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json('error occured!')
            }
            else {
                //console.log(result)
                return res.status(200).json(result)
            }
        })
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }

}

const deleteFile = (file) => {
    fs.rmSync('public' + file, { force: true })
}

export const editcompany = (req, res) => {

    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const { editCompData, prevEditCompData } = req.body
        const { id, company_logo, company_name, company_email, company_address, company_website, company_contact_no, company_status } = JSON.parse(editCompData)

        db.query('select * from companymanagement where company_name=? and id!=?', [company_name, id], async (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                //console.log(result)
                if (result.length === 0) {
                    try {
                        let logoPath;
                        if (req.file === undefined && company_logo !== '') {
                            logoPath = company_logo

                        }
                        else if (req.file === undefined && company_logo === '') {
                            logoPath = ''
                            const folder_path = JSON.parse(prevEditCompData).company_logo
                            if (folder_path !== '') {
                                deleteFile(folder_path)
                            }

                        }
                        else if (req.file !== undefined && JSON.parse(prevEditCompData).company_logo === '') {
                            logoPath = req.file.path
                            logoPath = logoPath.slice(logoPath.indexOf('\\'))

                        }
                        else {
                            const folder_path = JSON.parse(prevEditCompData).company_logo
                            if (folder_path !== '') {
                                deleteFile(folder_path)
                            }
                            logoPath = req.file.path
                            logoPath = logoPath.slice(logoPath.indexOf('\\'))

                        }
                        const q = 'update companymanagement set company_logo=?, company_name=?,company_email=?,company_address=?,company_website=?,company_contact_no=?,company_status=? where id=?'
                        const values = [logoPath, company_name, company_email, company_address, company_website, company_contact_no, company_status, req.params.id]
                        await db.promise().query(q, values)
                        return res.status(200).json('company details updated successfully')
                    }
                    catch (error) {
                        console.log(error)
                        return res.status(500).json('error occured!')
                    }
                }
                else {
                    return res.status(500).json('company name already exists!')
                }

            }

        })
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }



}

export const deletecompany = async (req, res) => {
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        //console.log(req.body)
        const { id, logos } = req.body
        try {
            logos.forEach(fol_path => {
                if (fol_path !== '') {
                    deleteFile(fol_path)
                }
            })
            const delete_companies_query = 'delete from companymanagement where id in (?)'
            await db.promise().query(delete_companies_query, [id])
            return res.status(200).json('Company Deleted Successfully')
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