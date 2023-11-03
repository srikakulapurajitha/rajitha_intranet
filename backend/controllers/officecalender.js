import db from "../config/connectiondb.js";

export const holidaylist = (req, res) => {

    const q = `SELECT  holidaylist_title, officeholidays.holiday_title, officeholidays.holiday_date FROM companypagesmanagement INNER JOIN officeholidays ON officeholidays.pageId = companypagesmanagement.id where company_pagestatus='active' ; `

    db.query(q, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json('error occured!')
        }
        else {
            console.log(result)
            return res.status(200).json(result)
        }
    })

};