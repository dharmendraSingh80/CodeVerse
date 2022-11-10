const nodeMailer = require('../config/nodemailer');

//this is another way of exporting a method
exports.sendResetPasswordMail = (name, email, token) => {
    
    let htmlString = nodeMailer.renderTemplate({name:name, token:token}, '/forgetMailer/forget_password.ejs');
    nodeMailer.transporter.sendMail({
        from:'dharmendra@coding.com',
        to: email,
        subject:'for reset password',
        html: htmlString
    }, (err, info) => {
        if(err){
            console.log('Error in sending mail', err);
            return;
        }
        // console.log('Message sent', info);
        return;
    });

    
}