var db = require('../config/db');
var Transaction = require('../models/Transaction');
var TransactionSent = require('../models/TransactionSent');
var Merchant = require('../models/Merchant');

var braintree = require('braintree');
var express = require('express');
var router  = express.Router();
var jwtUtils = require('../utils/jwtUtils');

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

gateway.config.timeout = 10000;

// Onboard submerchant TEST
router.post('/addtest', function(req, res) {
    jwtUtils.decryptToken(req, res)
        .then(function(token) {
            var userId = token.id;

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
                var merchantAccountId = result.merchantAccount.id;
                var merchantAccountStatus = result.merchantAccount.status;

                Merchant.forge({
                    user_id: userId,
                    merchant_name: merchantAccountId,
                    merchant_status: merchantAccountStatus
                })
                    .save()
                    .then(function(merchant) {
                        console.log('Merchant added successfully')
                        res.json({ success: true, message: 'Submerchant processed succesfully!', result: merchant});
                    })
                    .catch(function(err) {
                        console.log('Error adding Merchant: ' + err);
                        res.json({ success: false, message: 'Error occurred while adding merchant', result: err });
                    });
            });
        })
        .catch(function(err) {
            console.log('User not verified: ' + err);
            res.json({ success: false, message: 'User not verified.'});
        });
});


// Onboard submerchant
router.post('/add', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var userId = token.id;

            // Individual params
            var firstName = req.body.first_name,
                lastName = req.body.last_name,
                email = req.body.email,
                phone = req.body.phone,
                dateOfBirth = req.body.dob, // YYYY-MM-DD
                ssn = req.body.ssn,
                streetAddress = req.body.street_address,
                locality = req.body.locality,
                region = req.body.region,
                postalCode = req.body.postal_code,

            // Business (optional)
                legalName = req.body.legal_name,
                dbaName = req.body.dba_name, // "Doing Business As" Name
                taxId = req.body.tax_id,
                bStreetAddress = req.body.b_street_address,
                bLocality = req.body.b_locality,
                bRegion = req.body.b_region,
                bPostalCode = req.body.b_postal_code,

            // Funding
                descriptor = req.body.descriptor,
                fEmail = req.body.f_email,
                fMobilePhone= req.body.f_mobile_phone, // OPTIONAL
                accountNumber = req.body.account_number,
                routingNumber = req.body.routing_number,

            // Other
                tosAccepted = req.body.tos_accepted;

            merchantAccountParams = {
                individual: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    dateOfBirth: dateOfBirth,
                    ssn: ssn,
                    address: {
                        streetAddress: streetAddress,
                        locality: locality,
                        region: region,
                        postalCode: postalCode
                    }
                },
                business: {
                    legalName: legalName,
                    dbaName: dbaName,
                    taxId: taxId,
                    address: {
                        streetAddress: bStreetAddress,
                        locality: bLocality,
                        region: bRegion,
                        postalCode: bPostalCode
                    }
                },
                funding: {
                    descriptor: descriptor,
                    destination: braintree.MerchantAccount.FundingDestination.Bank,
                    email: fEmail,
                    mobilePhone: fMobilePhone,
                    accountNumber: accountNumber,
                    routingNumber: routingNumber
                },
                tosAccepted: tosAccepted,
                masterMerchantAccountId: "TheHourlyAdmin_marketplace"
            };

            gateway.merchantAccount.create(merchantAccountParams, function (err, result) {
                if (err) {
                    console.log('Error occurred while onboarding submerchant: ' + err);
                    res.json({ success: false, message: 'Error onboarding submerchant.'});
                }
                if (result.success == false) {
                    res.json({ success: false, message: 'Error onboarding submerchant.', result: result });
                }
                if (result.success == true) {
                    console.log('Merchant result: ' + JSON.stringify(result));
                    var merchantAccountId = result.merchantAccount.id;
                    var merchantAccountStatus = result.merchantAccount.status;

                    Merchant.forge({
                        user_id: userId,
                        merchant_name: merchantAccountId,
                        merchant_status: merchantAccountStatus
                    })
                        .save()
                        .then(function(merchant) {
                            console.log('Merchant added successfully');
                            res.json({ success: true, message: 'Submerchant processed succesfully!', result: merchant});
                        })
                        .catch(function(err) {
                            console.log('Error adding Merchant: ' + err);
                            res.json({ success: false, message: 'Error occurred while adding merchant', result: err });
                        });
                }

            });
        })
        .catch(function(err) {
            console.log('User not verified: ' + err);
            res.json({ success: false, message: 'User not verified.'});
        });
});

// Find submerchant
router.get('/', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            Merchant.forge({
                id: token.id
            })
                .fetch()
                .then(function(merchant) {
                    console.log('Merchant found: ' + JSON.stringify(merchant));
                    gateway.merchantAccount.find(merchant.attributes.merchant_name, function (err, merchantAccount) {
                        if (err) {
                            console.log('Error found: ' + err);
                            res.json({ success: false, message: 'Submerchant not found.'});
                        }
                        res.json({ success: true, message: 'Submerchant found!', result: merchantAccount});
                    });
                })
                .catch(function(err) {
                    res.json({ success: false, message: 'Submerchant not founded.', result: err });
                });
        })
        .catch(function(err) {
            console.log('User not verified: ' + err);
            res.json({ success: false, message: 'User not verified.'});
        });

});


// Get transaction by ID
router.get('/transaction/:id', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var transactionId = req.params.id;

            gateway.transaction.find(transactionId, function (err, transaction) {
                if (err) {
                    console.log('Error found: ' + err);
                    res.json({ success: false, message: 'Transaction not found.'});
                }
                res.json({ success: true, message: 'Transaction found!', result: transaction});
            });

        })
        .catch(function(err) {
            console.log('Error occurred: ' + err);
            res.json({ success: false, message: 'Error occurred', result: err });
        });

});

// Get transaction collection
router.get('/transaction', function(req, res){
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var sql = 'SELECT t.id, t.transaction, t.user_id, ts.user_id as "employee_id", t.job_id, t.amount, t.created_at, t.updated_at \
                        FROM transaction t \
                        JOIN transaction_sent ts \
                        ON t.id = ts.transaction_id \
                        WHERE t.user_id = ?';
            db.knex.raw(sql, [token.id])
                .then(function(transactions) {
                    res.json({ success: true, message: 'Transactions retrieved!', result: transactions.rows});
                })
                .catch(function(err) {
                    console.log('Transactions not found: ' + err);
                    res.json({ success: false, message: 'Transactions not found!'});
                });
        })
        .catch(function(err) {
            console.log('User not verified: ' + err);
            res.json({ success: false, message: 'User not verified', result: err });
        });

});

// Create client token
router.get("/client_token", function (req, res) {
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            gateway.clientToken.generate({}, function (err, response) {
                if (err) {
                    console.log('Error generating client token: ' + err);
                    res.json({ success: true, message: 'Client token failed.'});
                }
                res.json({ success: true, message: 'Client token created!', result: response.clientToken});
            });
        })
        .catch(function(err) {
            console.log('User not verified: ' + err);
            res.json({ success: false, message: 'User not verified.'});
        });

});

// TEST Checkout and confirm payment
router.post('/processtest', function(req, res) {
    var nonce = "fake-valid-nonce";
    var amount = req.body.amount;
    var service = amount * 0.1;
    var merchantId = req.body.merchant_id;
    var jobId = req.body.job_id;
    var employeeId = req.body.employee_id;

    jwtUtils.decryptToken(req, res)
        .then(function(token){
            gateway.transaction.sale({
                amount: amount,
                paymentMethodNonce: nonce,
                merchantAccountId: merchantId,
                serviceFeeAmount: service,
                options: {
                    submitForSettlement: true   ,
                    holdInEscrow: true
                }
            }, function (err, result) {
                if (err) {
                    console.log('Sale error: ' + err);
                    res.json({ success: true, message: 'Sale failed.'});
                }
                console.log('Trans result: ' + JSON.stringify(result));
                Transaction.forge({
                    user_id: token.id,
                    transaction: result.transaction.id,
                    amount: amount,
                    job_id: jobId
                })
                    .save()
                    .then(function(transaction) {
                        TransactionSent.forge({
                            user_id: employeeId,
                            transaction_id: transaction.id
                        })
                            .save()
                            .then(function(transactionSent) {
                                res.json({ success: true, message: 'Sale proccessed!', result: transaction});
                            });
                    })
                    .catch(function(err) {
                        console.log('Error occurred proccessing sale: ' + err );
                        res.json({ success: false, message: 'Sale failed.', result: err});
                    });
            });
        })
        .catch(function(err) {
            console.log('User not verified: ' + err);
            res.json({ success: false, message: 'User not verified.', result: err });
        });
});


// Checkout and confirm payment
router.post('/process', function(req, res) {
    var nonce = req.body.payment_method_nonce;
    var amount = req.body.amount;
    var jobId = req.body.job_id;
    var service = amount * 0.1;
    var merchant_id = req.body.merchant_id;
    var employeeId = req.body.employee_id;
    
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            gateway.transaction.sale({
                amount: amount,
                paymentMethodNonce: nonce,
                merchantAccountId: merchant_id,
                serviceFeeAmount: service,
                options: {
                    submitForSettlement: false,
                    holdInEscrow: true

                }
            }, function (err, result) {
                if (err) {
                    console.log('Sale error: ' + err);
                    res.json({ success: false, message: 'Sale failed.'});
                }
                Transaction.forge({
                    user_id: token.id,
                    transaction: result.transaction.id,
                    amount: amount,
                    job_id: jobId

                })
                    .save()
                    .then(function(transaction) {
                        TransactionSent.forge({
                            user_id: employeeId,
                            transaction_id: transaction.id
                        })
                            .save()
                            .then(function(transactionSent) {
                                res.json({ success: true, message: 'Sale proccessed!', result: transaction});
                            });
                    })
                    .catch(function(err) {
                        console.log('Error occurred proccessing sale: ' + err );
                        res.json({ success: false, message: 'Sale failed.', result: err});
                    });
            });
        })
        .catch(function(err) {
            console.log('User not verified: ' + err);
            res.json({ success: false, message: 'User not verified.', result: err });
        });
});

// Release from escrow
router.post('/release', function(req, res) {
    jwtUtils.decryptToken(req, res)
        .then(function(token){
            var jobId = req.body.job_id;
            var userId = token.id;

            Transaction.forge({
                user_id: userId,
                job_id: jobId
            })
                .fetch()
                .then(function(transaction) {
                    console.log('Transaction from release: ' + JSON.stringify(transaction));
                    var transactionId = transaction.id;

                    gateway.transaction.releaseFromEscrow(transactionId, function(err, result) {
                    }), function(err, result) {
                        console.log('Escrow release results: ' + JSON.stringify(result));
                        if (err) {
                            console.log('Error releasing funds from escrow: ' + err);
                            res.json({ success: false, message: 'Error releasing funds from escrow.', result: err });
                        }
                        if (result.success == false) {
                            res.json({ success: false, message: 'Error releasing funds from escrow.', result: result });
                        }
                        if (result.success == true) {
                            res.json({ success: true, message: 'Funds released from escrow.', result: result });
                        }
                        res.json({ success: what, result: result});
                    }
                })
                .catch(function(err) {
                    console.log('Transaction not found: ' + err);
                    res.json({ success: false, message: 'Transaction not found.', result: err });
                });
        })
        .catch(function(err) {
            console.log('User not verified: ' + err);
            res.json({ success: false, message: 'User not verified.', result: err });
        });
});

module.exports = router;