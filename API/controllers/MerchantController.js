var braintree = require('braintree');
var express = require('express');
var router  = express.Router();
var jwtUtils = require('../utils/jwtUtils');

var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   '89h2d2rdg9v27kkx',
    publicKey:    'pjk2zt3dm7cb6t6d',
    privateKey:   '6ecc37981716e3b1b6699252806acbf6'
});

gateway.config.timeout = 10000;

// Onboard submerchant
router.post('/add', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            merchantAccountParams = {
                individual: {
                    firstName: "Jones",
                    lastName: "fasdf",
                    email: "jane@14ladders.com",
                    phone: "5552334444",
                    dateOfBirth: "1981-11-19",
                    ssn: "456-45-4567",
                    address: {
                        streetAddress: "111 Main St",
                        locality: "Chicago",
                        region: "IL",
                        postalCode: "60622"
                    }
                },
                business: {
                    legalName: "Jane's Ladders",
                    dbaName: "Jane's Ladders",
                    taxId: "91-7654321",
                    address: {
                        streetAddress: "111 Main St",
                        locality: "Chicago",
                        region: "IL",
                        postalCode: "60622"
                    }
                },
                funding: {
                    descriptor: "Blue Laddersf",
                    destination: braintree.MerchantAccount.FundingDestination.Bank,
                    email: "fundi1ng@blueladders.com",
                    mobilePhone: "5555555555",
                    accountNumber: "1123581321",
                    routingNumber: "071101307"
                },
                tosAccepted: true,
                masterMerchantAccountId: "mogadigitalllc"
            };

            gateway.merchantAccount.create(merchantAccountParams, function (err, result) {
                if (err) {
                    console.log('Error occurred while onboarding submerchant: ' + err);
                    res.json({ success: false, message: 'Error onboarding submerchant.'});
                }
                res.json({ success: true, message: 'Submerchant onboarded succesfully!', result: result});
            });
        })
        .catch(function(err) {
            console.log('User not verified: ' + err);
            res.json({ success: false, message: 'User not verified.'});
        });
});

// Find submerchant
router.post('/find', function(req, res){
    var customerId = req.body.customer_id;

    gateway.merchantAccount.find(customerId, function (err, merchantAccount) {
        if (err) {
            console.log('Error found: ' + err);
            res.json({ success: false, message: 'Submerchant not found.'});
        }
        res.json({ success: true, message: 'Submerchant found!', result: merchantAccount});
    });
});

// Create client token
router.get("/client_token", function (req, res) {
    gateway.clientToken.generate({}, function (err, response) {
        if (err) {
            console.log('Error generating client token: ' + err);
            res.json({ success: true, message: 'Client token failed.'});
        }
        res.json({ success: true, message: 'Client token created!', result: response.clientToken});
    });
});

// Checkout and confirm payment
router.post('/process', function(req, res) {
    var nonce = req.body.payment_method_nonce;
    var total = req.body.total;
    var service = req.body.service;
    var merchant_id = req.body.merchant_id;

    gateway.transaction.sale({
        amount: "10.00",
        paymentMethodNonce: nonceFromTheClient,
        merchantAccountId: "janesladders_instant_00ht8q89",
        options: {
            submitForSettlement: true
        }
    }, function (err, result) {
        if (err) {
            console.log('Sale error: ' + err);
            res.json({ success: true, message: 'Sale failed.'});
        } 
        console.log('Sale success: ' + result);
        res.json({ success: true, message: 'Sale successful!', result: result});
    });

    // gateway.transaction.sale({
    //     amount: total,
    //     merchantAccountId: merchant_id,
    //     paymentMethodNonce: nonce,
    //     serviceFeeAmount: service
    // }, function (err, result) {
    //     res.json({ success: true, message: 'Sale processed.', result: result});
    // });
});


// ** WEBHOOK RESPONSES
// Webhook response for submerchant
router.post('/submerchant', function(req, res){

    gateway.webhookNotification.parse(
        req.body.bt_signature,
        req.body.bt_payload,
        function (err, webhookNotification) {
            if (err) {
                console.log('FUCKKKKK: ' + err);
            }
            console.log("[Webhook Received " + webhookNotification.timestamp + "] | Kind: " + webhookNotification.kind);
            console.log(JSON.stringify(webhookNotification));
        }
    );
});


module.exports = router;