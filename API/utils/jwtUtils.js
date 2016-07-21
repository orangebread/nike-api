var jwt = require('jsonwebtoken');
var CONSTANTS = require('../config/constants');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

//
// function verifyUser(username, password, done) {
//     console.log(arguments)
//     User.findOne({ 'local.username' : username }, function(err, user) {
//         if (err)
//             return done(err);
//         if (!user)
//             return done(null, false);
//
//         if (!user.validPassword(password))
//             return done(null, false);
//
//         return done(null, user);
//     });
// }
//
// module.exports.issueToken = function(req,res){
//
//     //grab username and password
//     var username = req.body.username;
//     var password = req.body.password;
//
//     //both username and password required;
//     if(!username || !password){
//         return res.json(403,{error: 'username and password required'});
//     }
//
//     //verify
//     verifyUser(username,password,function(err,user){
//
//         if(err){
//             return res.json(403,{error: 'invalid username or password'});
//         }
//
//         if(!user){
//             return res.json(403,{error: 'invalid username or password'})
//         }
//
//
//         //send some user profile details
//         var profile = {
//             username : user.local.username,
//             id: user._id
//             //etc
//         }
//
//         //create a new token
//         var token = jwt.sign(profile, tokenSecret, { expiresInMinutes : 60 });
//
//         //send the response;
//         return res.json({token: token, user: profile });
//     })
// };

module.exports.hashPassword = function(password) {
    console.log('Hashing password...');
    return new Promise(function (resolve, reject) {
        bcrypt.hash(password, null, null, function(err, hash) {
            console.log('In the hash...');
            if (err) reject(err);
            resolve(hash);
        });
    });
};


module.exports.decryptToken = function(req, res) {
    console.log('decryptToken');
    return new Promise(function(resolve, reject) {
        console.log('in the decrypting...');
        var token = req.headers.token || req.headers.authorization || req.body.token || req.query.token;
        console.log('TOKEN FOUND: ' + token);
        jwt.verify(token, CONSTANTS.SECRET, function(err, decoded) {
            if (err) {
                console.log('TOKEN ERROR FUCK: ' + err);
                reject(res.json({ success: false, message: 'Failed to decrypt token.' }));
            } else {
                console.log('TOKEN FUCK SUCCESS: ' + JSON.stringify(decoded));
                var newToken = {
                    id: decoded.id,
                    email: decoded.email
                }
                resolve(newToken);
            }
        });
    });
}

module.exports.verifyToken = function(req, res){
    console.log('verify Token');
    return new Promise(function(resolve, reject) {

        var token = req.headers.authorization || req.headers.token || req.query.token;

        if(!token){
            reject(res.json({ success: false, message: 'Token required!'}));
        }

        jwt.verify(token, CONSTANTS.SECRET, function(err, payload){
            if(err){
                reject(err);
            };
            console.log('verified token: ' + JSON.stringify(payload));
            resolve(payload);
        });
    });
}

module.exports.createToken = function(payload) {
    console.log('createToken');
    var tokenInfo = {
        id: payload.id,
        email: payload.email
    }
    return jwt.sign(tokenInfo, CONSTANTS.SECRET, { expiresIn : CONSTANTS.TOKEN_EXPIRE });
}

module.exports.refreshToken = function(decoded) {
    console.log('refreshToken');
    var token_exp,
        now,
        newToken;
    var date = new Date();

    token_exp = decoded.exp;
    now = date;

    if((token_exp - now) < CONSTANTS.TOKEN_EXPIRE) {
        newToken = this.createToken(decoded);
        if(newToken) {
            return newToken;
        }
    } else {
        return null;
    }
};