import db from "../config/connectiondb.js";
import cron from "node-cron"
import transporter from "../config/emailconfig.js";




cron.schedule('02 17 * * *', () => {
    sendFestiveGreetings()},        
    {
      scheduled: true,
      timezone: "Asia/Kolkata"
    });


//Holidays Description

const HolidaysDescription = {
    'republic day': [

`Dear Employees,

On this auspicious occasion on Republic Day, I would like to extend my warmest wishes to all of you.
Let us take a mpvement remember the sacrifices of our freedom fighters and honor the sprit of our great nation.

Happy Republic Day to you and your family.

Thank You
Greetings`,'https://i.ibb.co/59QMxsV/independenceday.png'
    ],

    'independence day': [

`Dear Employees,

As we celebrate this Independence Day, 
I wanted to take a moment to express my heartfelt gratitude to each and every one of you.
Today, we gather here to celebrate a remarkable moment in the history of our nation - Independence Day. 
It is a day when we remember the sacrifices, the struggles, 
and the unwavering determination of our forefathers who fought tirelessly to secure our freedom. 
It is a day when we come together to honor the values that define our great nation - liberty, 
equality, and justice for all.
    
Thank You
Greetings`, "https://i.ibb.co/k8jBVyY/independence.png"
    ],

    'gandhi jayanthi': [
`Dear Employees,
    
Wishing you a peaceful and meaningful Gandhi Jayanti. 
May Gandhiji's message of love and unity continue to inspire us all. 
Happy Gandhi Jayanti!
    
Thank You 
Greetings`, "https://i.ibb.co/6RmZGFK/gandhijayanthi.png"
    ],

    'christmas': [

`Dear Employees,
    
May your Christmas be filled with love, joy, and warmth.

Wishing you and your family a Merry Christmas!
    
Thank You 
Greetings`, "https://i.ibb.co/n0n2LJJ/christmas.png"
    ],

    'ugadi': [

`Dear Employees,

May the divine blessings of Lord Brahma bring you wisdom, knowledge, 
and prosperity on this Ugadi and throughout the year. 

Happy Ugadi
Thank You
Greetings`, "https://i.ibb.co/RzDWBp3/ugadi.png"
    ],

    'srirama navami': [

`Dear Employees,

May Lord Rama bless you with strength, 
courage, and wisdom on the auspicious occasion of Ram Navami. 
Happy Ram Navami to you and your Family!`, "https://i.ibb.co/7KBgLxN/ramanavami.png"
    ],

    'dussehra': [

`Dear Employees,

As the effigy of Ravana burns, 
may all your troubles and worries vanish into thin air.

Happy Dussehra to you and your loved ones.`, "https://i.ibb.co/XWXNvK2/dussehra.png"
    ],

    'holi': [
    
`Dear Employees,

May the festival of Holi paint your life with the shades of love, prosperity, 
and good health. Have a colorful and cheerful Holi.
Happy Holi to you and your family!
    
Thank you
Greetings`, "https://i.ibb.co/whgDrXp/holi.png"],

    'ganesh chathurthi': [

`Dear Employees,

On this Ganesh Chaturthi, may your life be filled with new beginnings, 
and may all your endeavors be successful. 
Happy Ganesh Chaturthi to you and your family!
    
Thank You
Greetings`,`https://i.ibb.co/hfDBWNS/ganeshchaturthi.png`
    ],
    'sankranthi' : [

`Dear Employees,

May the kites of your dreams soar high, 
may you achieve new heights of success and happiness,
may your life be filled with the sweet taste of tilgul and the warmth of the sun's blessings.

Wishing you and your family a harvest of happiness and sweet moments this Makar Sankranti.

Thank You
Greetings`,`https://i.ibb.co/mG3zPTK/sankranthi.png`
    ],
    'ramdan' :[

`Dear Employees,

As the crescent moon is sighted, and the holy month of Ramadan begins,
May the spirit of Ramadan illuminate your world and show you the way to peace and harmony.

Wishing you and Your family Ramadan Mubarak!

Thank You
Greetings`,`https://i.ibb.co/XsdGsPQ/ramdan.png`
    ],
    "new year" :[

`Dear Employees,

May you and your family be blessed with happiness, good health, 
and prosperity in the New Year.
Wishing you 365 days of success, 
52 weeks of laughter, and 
12 months of love in the upcoming year.

Happy New Year to you all`,'https://i.ibb.co/WP42KKv/newyear.gif'
    ],
    'diwali' : [

`Dear Employees,

On this auspicious festival of lights, may the glow of joy, prosperity, 
and happiness illuminate your days in the year ahead.

Wishing you a Diwali that brings happiness, prosperity, and abundance to your life.

Happy Diwali to you and your loved ones.`,'https://i.ibb.co/TDfzQpH/diwali.png'
    ]
}


const getHolidaysQuery = `select distinct holiday_date,holiday_title from companypagesmanagement inner join officeholidays on id=pageId where company_name = 'Brightcomgroup India' and company_pagestatus='active'`


  export const sendFestiveGreetings = ()=>{
    console.log('running')
    
    const today = (new Date()).toLocaleString()
    db.query(getHolidaysQuery,(err,res)=>{
        //console.log(res)
        if(err) console.log(err)
        else{
            //console.log(res)
            
            res.forEach(data=>{
                console.log(data.holiday_date,'-',data.holiday_title)
                if ((data.holiday_date).toLocaleString()===today){
                    console.log(data.holiday_title)
                    const holidayTitle = (data.holiday_title).toLowerCase()
                    if(HolidaysDescription[holidayTitle]){
                    var mailOptions = {
                        from: '"Brightcomgroup" <akashdandge100@gmail.com>', // sender address
                         // list of receivers
                        envelope: {
                            from: 'Brightcomgroup" <akashdandge100@gmail.com>',
                            to: ['dibyakantid@brightcomgroup.com','deepthim@brightcomgroup.com','shreyav@brightcomgroup.com','karthikd@brightcomgroup.com','rajithas@brightcomgroup.com','madhavas@brightcomgroup.com','akashd@brightcomgroup.com']
                        },
                        subject: `Happy ${data.holiday_title}`,
                        template: 'holidayGreetings', // the name of the template file i.e email.handlebars
                        context:{
                            msg: HolidaysDescription[holidayTitle][0] ,
                            sender_name: 'Brightcomgroup India',
                            img:HolidaysDescription[holidayTitle][1]
                        }
                    };
                }
                else{
                    var mailOptions = {
                        from: '"Brightcomgroup" <akashdandge100@gmail.com>', // sender address
                        to: ['dibyakantid@brightcomgroup.com','deepthim@brightcomgroup.com','shreyav@brightcomgroup.com','karthikd@brightcomgroup.com','rajithas@brightcomgroup.com','madhavas@brightcomgroup.com','akashd@brightcomgroup.com'], // list of receivers
                        subject: 'Holiday Greetings',
                        template: 'holidayGreet', // the name of the template file i.e email.handlebars
                        context:{
                            msg: 
                            `
                            Happy ${holidayTitle} ` ,
                            sender_name: 'Brightcomgroup India',
                            
                        }
                    };

                }
                    
                    // trigger the sending of the E-mail
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            return console.log(error);
                        }
                        console.log(info)
                        console.log('Message sent: ' + info.response);
                    });
                    
                    
                }
            })
        }
    })
    
  }


  
//sendFestiveGreetings()


