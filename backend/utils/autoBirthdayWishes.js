import db from "../config/connectiondb.js";
import cron from "node-cron"
import {transporter} from "../config/emailconfig.js";


const wishes = [`For all the good work you have done, it’s not enough to say that you are just a good employee. It’s decided- you are (to put it simply) a great person! May every day be filled with happiness, good health, and marvelous luck. Enjoy your birthday and a great year ahead.`,`Accordingly, for being the most incredible employee and the most versatile member of our team, your birthday is a big deal for us. Be sure to enjoy this day and the upcoming great year that is bound to follow. Happiest birthday to you.`,
`A good employee is rare. A great employee is a myth. Except for the fact that we discovered the latter in you. We all see you as being an integral part of our business and team. May this birthday usher in a new era of harmony, joy, and fortune for you. Warm greetings on your birthday.`,`This day is momentous, considering that you circumvented the sun once more. May this signify a series of greats for you- a great day, a great year, a great life. Thus, put on a smile and enjoy this day to the fullest. Happy Birthday!`,`Happy birthday to a person who is always there for any member of our team, who manages to pull off a great job, who’s a great person overall, and an even more wonderful employee. Enjoy this day to your fullest!
`,`An amazing employee like you is more priceless to us than our everyday problems. Even more surprising is how you manage to build a stronger bond each day with every member of our team. Finally wishing that your every day is filled with happiness and good health. Happy birthday!`,`Today is a great day to get started on another 365-day journey. It’s a fresh start to new beginnings, new hopes, and great endeavors. Besides, be sure to have adventures along the way. Wishing you the best of today and every day in the future!
`,`Hoping that the rest of your year be filled with the same amount of happiness, friendliness, and love that you bring among all the members of our team. Thereby, enjoy this day because you deserve more than the best. Happy birthday to you!`,`A great person deserves remarkable things. And we expect nothing less from you because you are the warmest and the most deserving person to whom amazing things should happen. Wishing you a wonderful birthday and a great year ahead!`,`Words alone are not enough to express how talented and humble you are. Likewise, your very nature makes every day of our work life a pleasure, and we couldn’t wish but a very amazing year ahead of you. The warmest wishes and the happiest regards on your birthday!`,
`You have managed to fulfill every expectation, ride over every obstacle while being an amazing employee. You must be no less of a superhuman to achieve these feats. It makes us glad about the day we decided to hire you. Wishing you the happiest birthday!`

]

cron.schedule('00 09 * * *', () => {sendBirthDayGreetings()},
    {
        scheduled: true,
        timezone: "Asia/Kolkata"
    }
);

function sendBirthDayGreetings(){
    //console.log('working')
    const today = new Date()
    //console.log(today,today.getDate(),today.getMonth())
    const find_birthdays_query = `select concat(first_name,' ', last_name) as fullname, email from usermanagement where day(date_of_birth)= ? and month(date_of_birth)=? and status='active' `
    const find_birthdays_values = [today.getDate(),today.getMonth()+1]
    db.query(find_birthdays_query,find_birthdays_values,(err,result)=>{
        if(err){
            console.log(err)

        }
        else{
            if(result.length!==0){
                const mails = result.map(data=>data.email)
                //console.log(mails)
                const mailOptions = {
                    
                    envelope: {
                        from: 'Brightcomgroup" <akashdandge100@gmail.com>',
                        to: mails
                    },
                    subject: `Happy Birthday`,
                    template: 'BirthdayGreeting', 
                    context:{
                        message:wishes[Math.floor(Math.random()*wishes.length)],
                        from: 'Brightcom Group'
                    }
                };
                transporter.sendMail(mailOptions,(error,info)=>{
                    if(error){
                        return console.log(error);
                    }
                    // console.log(info)
                    //console.log('Message sent: ' + info.response);
                })
            //console.log(result)                
            }
            
        }
    })
}

//sendBirthDayGreetings()