import hbs from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer'
import path from 'path'
import 'dotenv/config'

// initialize nodemailer
var transporter = nodemailer.createTransport(
    {
        service: 'gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
    }
);

// point to the template folder
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))

export default transporter