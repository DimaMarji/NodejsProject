const pool = require('./pool');
const bcrypt = require("bcrypt");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300, checkperiod: 150 });

var User = (user) => {
    this.id = user.id;
    this.userName = user.userName;
    this.email = user.email;
    this.password = user.password;
    this.roleId = user.roleId;
};
User.getAll = (result) => {
    pool.query("SELECT * FROM user", (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

User.getById = (userId, result) => {
    cacheValue = cache.get(`user${userId}`);
    if (cacheValue == undefined) {
        pool.query('SELECT * FROM user WHERE id = ?', userId, (err, res) => {
            if (err) {
                result(err, null);
            } else {
                if (res.length === 0) { // The user is not found for the given id
                    result(null, {});
                } else {
                    cache.set(`user${userId}`, res);
                    result(null, res[0]);
                }
            }
        });
    } else {
        result(null, cacheValue);
    }
};

User.register = (user, result) => {
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            result(err, null);
        } else {
            pool.query("INSERT INTO user SET userName = ? , email = ? , password = ? , roleId =? ", [user.userName, user.email, hash, user.roleId], (err, res) => {
                if (err) {
                    result(err, null);
                } else {
                    result(null, Object.assign({ id: res.insertId }, user)); // Merge 2 objects
                }
            });
        }
    });
};
User.login = (userName, password, result) => {
    pool.query('SELECT * FROM user WHERE userName = ?', userName, (err, res) => {
        if (err) {
            connection.release();
            result(err, null, 500);
        } else {
            if (res.length === 0) { // The user is not found for the given userName
                result({ Error: "Error in user name or password" }, null, 400);
            } else {
                const user = res[0];
                bcrypt.compare(password, user.password, (err, isCorrect) => {
                    if (err) {
                        result(err, null, 500);
                    } else {
                        if (!isCorrect) {
                            result({ Error: "Error in user name or password" }, null, 400);
                        } else {
                            // The user name and the password are correct
                            result(null, user, 200);
                        }
                    }
                }); // end bcrypt.compare
            }
        }
    });
};
module.exports = User;
