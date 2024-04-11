import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'rubbankteam@gmail.com',
        pass: 'pato lfvi gzky nlbu',
    },
});

transporter.use('compile', hbs({
    viewEngine: {
        extname: '.handlebars',
        partialsDir: path.resolve('./src/resources/mail'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./src/resources/mail'),
    extName: '.handlebars',
}));

export default transporter;