var debug = require('debug')('mailer');

var nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool');

var emailService = require('./config').emailService;
var senderEmail = require('./config').senderEmail;
var senderPass = require('./config').senderPass;

var options = {
  service: emailService,
  auth: {
    user: senderEmail,
    pass: senderPass
  },
  maxConnections: 20,
  maxMessages: 100
};

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport(smtpPool(options));

var mailOptions = {
  from: senderEmail,
  subject: 'HN Newsletter'
  // to: 'email',
  // text: data
  // html: '<b>Hello world ✔</b>'
};


module.exports = {
  sendEmail: function (to, data) {
    mailOptions.to = to;
    mailOptions.text = data;
    debug(senderEmail);
    debug(mailOptions);    
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
      } else {
        console.log('Message sent: ' + info.response);
      }
    });    
  }
}