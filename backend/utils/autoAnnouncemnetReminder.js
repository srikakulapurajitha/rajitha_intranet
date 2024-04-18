import db from "../config/connectiondb.js";
import cron from "node-cron"
import { basictransporter } from "../config/emailconfig.js";

cron.schedule('00 09 * * *', () => { Reminder() },
    {
        scheduled: true,
        timezone: "Asia/Kolkata"
    }
);


function Reminder() {
    const today = new Date()
    console.log(today)
    const find_announcement_query = `select * from announcement where to_date=date(?) and from_date != to_date and notify='yes'`
    const find_announcement_values = [today]
    db.query(find_announcement_query, find_announcement_values, (err, res) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(res)
            res.forEach(ann => {
                const { company_name, department, title, description } = ann
                const q = `select email from usermanagement where department rlike? and company_name=? and status='active'`
                const v = [department.replace(',','|'), company_name]
                db.query(q, v, (error, result) => {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        console.log(result)
                        const mails = result.map(e => e.email)
                        if (mails.length !== 0) {

                            const mailDetails = {
                                from: '"Brightcomgroup" <akashdandge100@gmail.com>',
                                to: mails,
                                subject: `Announcement(Reminder): ` + title,
                                text: description
                            }
                            basictransporter.sendMail(mailDetails, (err, info) => {
                                if (err) {
                                    console.log(err)

                                }
                                else {
                                    console.log(info)

                                }

                            })

                        }
                    }
                })



            });

        }
    })

}

//Reminder()