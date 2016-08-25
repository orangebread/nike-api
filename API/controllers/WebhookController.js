var braintree = require('braintree');
var express = require('express');
var router  = express.Router();
var globals = require('../config/globals');

var User = require('../models/User');
var Merchant = require('../models/Merchant');

var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   '89h2d2rdg9v27kkx',
    publicKey:    'pjk2zt3dm7cb6t6d',
    privateKey:   '6ecc37981716e3b1b6699252806acbf6'
});

// Webhook response for submerchant
router.post('/submerchant', function(req, res){

    gateway.webhookNotification.parse(
        req.body.bt_signature,
        req.body.bt_payload,
        function (err, webhookNotification) {
            console.log("[Webhook Received " + webhookNotification.timestamp + "] | Kind: " + webhookNotification.kind);
            console.log(JSON.stringify(webhookNotification));

            if (err) {
                console.log('FUCKKKKK: ' + err);
            }
            if (webhookNotification.kind === braintree.WebhookNotification.Kind.SubMerchantAccountApproved) {
                Merchant.forge({
                    user_id: globals.user,
                    merchant_name: webhookNotification.subject.merchantAccount.id,
                    merchant_status: webhookNotification.subject.merchantAccount.status
                })
                    .save()
                    .then(function(merchant){
                        console.log('Merchant added: ' + JSON.stringify(merchant));
                    })
                    .catch(function(err) {
                        console.log('Merchant adding error: ' + err);
                    });
            }

        }
    );
});

module.exports = router;