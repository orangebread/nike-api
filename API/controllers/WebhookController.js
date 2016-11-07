var braintree = require('braintree');
var express = require('express');
var router  = express.Router();
var emailService = require('../utils/emailService');

var User = require('../models/User');
var Merchant = require('../models/Merchant');

var environment = {
    development: {

    },
    production: {

    }
}

// Sandbox
// var gateway = braintree.connect({
//     environment:  braintree.Environment.Sandbox,
//     merchantId:   '89h2d2rdg9v27kkx',
//     publicKey:    'pjk2zt3dm7cb6t6d',
//     privateKey:   '6ecc37981716e3b1b6699252806acbf6'
// });

// Live
var gateway = braintree.connect({
    environment:  braintree.Environment.Production,
    merchantId:   '49y9824s4ym6dw4w',
    publicKey:    'f8c32gq3hz5xd7kp',
    privateKey:   'b867f37ebb39132ab8f8e51f4abfd9f7'
});

// Webhook response for submerchant
router.post('/submerchant', function(req, res){
    console.log('ANYTHING HAPPENING HERE?');
    gateway.webhookNotification.parse(
        req.body.bt_signature,
        req.body.bt_payload,
        function (err, webhookNotification) {
            console.log("[Webhook Received " + webhookNotification.timestamp + "] | Kind: " + webhookNotification.kind);
            console.log(JSON.stringify(webhookNotification));

            var merchantAccountId = webhookNotification.subject.merchantAccount.id;
            var merchantAccountStatus = webhookNotification.subject.merchantAccount.status;

            if (err) {
                console.log('FUCKKKKK: ' + err);
            }
            if (webhookNotification.kind === braintree.WebhookNotification.Kind.Check) {
                console.log('Listening to Braintree Webhooks');
            }
            if (webhookNotification.kind === braintree.WebhookNotification.Kind.SubMerchantAccountApproved) {
                Merchant.forge({ merchant_name: merchantAccountId })
                    .fetch()
                    .then(function(merchant) {
                        merchant.save({ merchant_status: merchantAccountStatus })
                            .then(function(done) {
                                User.forge({ id: merchant.attributes.user_id })
                                    .fetch()
                                    .then(function(user) {
                                        var email = user.attributes.email;
                                        console.log('Sucessfully added merchant info: ' + done);
                                        emailService.sendEmail(email,'Hourly Admin - Submerchant Approved!', 'Your Hourly Admin account has been approved.')
                                            .then(function(success) {
                                                console.log('Email sent: ' + JSON.stringify(success));
                                                console.log('Merchant added: ' + JSON.stringify(merchant));
                                            });
                                    });
                            })
                    })
                    .catch(function(err) {
                        console.log('Error occurred saving Merchant info: ' + err);
                    });

            }
            if (webhookNotification.kind === braintree.WebhookNotification.Kind.SubMerchantAccountDeclined) {
                Merchant.forge({ merchant_name: merchantAccountId })
                    .fetch()
                    .then(function(merchant) {
                        merchant.save({ merchant_status: merchantAccountStatus })
                            .then(function(done) {
                                User.forge({ id: merchant.attributes.user_id })
                                    .fetch()
                                    .then(function(user) {
                                        var email = user.attributes.email;
                                        console.log('Sucessfully added merchant info: ' + done);
                                        emailService.sendEmail(email,'Hourly Admin - Submerchant Rejected', 'Your Hourly Admin account has been rejected.')
                                            .then(function(success) {
                                                console.log('Email sent: ' + JSON.stringify(success));
                                                console.log('Merchant added: ' + JSON.stringify(merchant));
                                            });
                                    });
                            })
                    })
                    .catch(function(err) {
                        console.log('Error occurred saving Merchant info: ' + err);
                    });
            }

        }
    );
});

module.exports = router;