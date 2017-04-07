var Promise = require('bluebird');

function contactsModel(options) {
    var db;

    if (!options.db) {
        throw new Error("Options.db is required.");
    }

    db = options.db;

    return {
        create: function(payload) {
            return new Promise(function(resolve, reject) {
                var email = payload.email;
                var password = payload.password;
                var firstName = payload.firstName || '';
                var lastName = payload.lastName || '';

                if (email == '' || email == null
                    || password == '' || password == null) {
                    reject("Email and password are required.");
                }
                db.run("INSERT INTO contacts VALUES ($null, $email, $password, $firstName, $lastName)",
                    {
                        $null: null,
                        $email: email,
                        $password: password,
                        $firstName: firstName,
                        $lastName: lastName
                    })
                    .then(function(result) {
                        resolve(result);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            });
        },

        getById: function(payload) {
            return new Promise(function(resolve, reject) {
                var id = payload.id;
                db.all("SELECT * FROM contacts WHERE id = ?", id)
                    .then(function(result) {
                        resolve(result);
                    })
                    .catch(function(err) {
                        reject(err);
                    });

            });
        },

        getAll: function(payload) {
            return new Promise(function(resolve, reject) {
                if (!payload) {
                    db.all("SELECT * FROM contacts")
                        .then(function(result) {
                            resolve(result);
                        })
                        .catch(function(err) {
                            reject(err);
                        });
                } else {
                    db.all("SELECT * FROM contacts")
                        .then(function(result) {
                            filterResults(result, payload)
                                .then(function(found) {
                                    resolve(found);
                                })
                                .catch(function(err) {
                                    reject(err);
                                });
                        })
                        .catch(function(err) {
                            reject(err);
                        });
                }
            });
        },

        update: function(payload) {
            return new Promise(function(resolve, reject) {
                var id = payload.id;
                var email = payload.email;
                var password = payload.password;
                var firstName = payload.firstName;
                var lastName = payload.lastName;
                db.all("SELECT * FROM contacts WHERE id = $id", {
                    $id: id
                })
                    .then(function(contact) {
                        db.run("UPDATE contacts SET email = $email, password = $password, firstName = $firstName, lastName = $lastName " +
                            "   WHERE id = $id",
                            {
                                $id: id,
                                $email: email || contact[0].email,
                                $password: password || contact[0].password,
                                $firstName: firstName || contact[0].firstName,
                                $lastName: lastName || contact[0].lastName
                            })

                    })
                    .catch(function(err){
                        reject(err);
                    });

            });
        },

        delete: function(payload) {
            return new Promise(function(resolve, reject) {
                var id = payload.id;

                db.run("DELETE FROM contacts WHERE id = $id", {
                    $id: id
                })
                    .then(function(result) {
                        resolve(result);
                    })
                    .catch(function(err){
                        reject(err);
                    });

            });
        }
    }

    // private funcs
    function filterResults(data, filterOptions) {
        console.log(JSON.stringify(data));
        return new Promise(function(resolve, reject) {
            for (var row in data) {
                if (filterOptions.email == data[row]['email']) {
                    console.log('Found!' + data[row]['email']);
                    resolve(data[row]);
                }
            }
            reject(data);
        });
    }
}

module.exports = contactsModel;