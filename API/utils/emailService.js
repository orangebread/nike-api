var nodemailer = require('nodemailer');
var Promise = require('bluebird');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://hourlyadm.alerts%40gmail.com:ThisIsSparta7229@smtp.gmail.com');

module.exports.sendEmail = function(receiver, subject, html) {
    console.log('Sending email...');

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"noreply@hourlyadmin.com" <hourlyadm.alerts@gmail.com>', // sender address
        to: receiver, // receiver
        subject: subject, // Subject line
        // text: message, // plaintext body
        html: html // html body
    };

    return new Promise(function(resolve, reject) {
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                reject(error);
            }
            resolve(info);
        });
    });

};