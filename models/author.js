const pool = require('./pool');
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 120, checkperiod: 600 });

class Author {
    constructor(author) {
        this.id = author.id;
        this.name = author.name;
     
    }
}

Author.getAllAuthors = (result) => {
    pool.query('SELECT * FROM author ORDER BY id ', (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

Author.getById = (authorId, result) => {
    cacheValue = cache.get(`author${authorId}`);
    if (cacheValue == undefined) {
        pool.query('SELECT * FROM author WHERE id = ?', authorId, (err, res) => {
            if (err) {
                result(err, null);
            } else {
                if (res.length === 0) { // The book is not found for the givent id
                    result(null, {});
                } else {
                    cache.set(`author${authorId}`, res);
                    result(null, res);
                }
            }
        });
    } else {
        result(null, cacheValue);
    }
};

Author.getByname = (authorname, result) => {
    cacheValue = cache.get(`author${authorname}`);
    if (cacheValue == undefined) {
        pool.query('SELECT * FROM author WHERE name = ?', authorname, (err, res) => {
            if (err) {
                result(err, null);
            } else {
                if (res.length === 0) { // The user is not found for the givent id
                    result(null, {});
                } else {
                    cache.set(`author${authorname}`, res);
                    result(null, res);
                }
            }
        });
    } else {
        result(null, cacheValue);
    }
};




Author.createAuthor = (newAuthor, result) => {
    pool.query("INSERT INTO author (name) VALUES ( ? )", newAuthor.name, (err, res) => {
        if (err) {
            console.log("error", err);
            result(err, null, 500);
        } else {
            console.log(res)
            result(null, { "id": res.insertId, "name": newAuthor.name});


        }
    });

};


Author.deleteAuthor = (authorId, result) => {
    pool.getConnection((err, connection) => {
        if (err) {
            result(err, null, 500);
        } else {
            connection.query(`SELECT * FROM author WHERE id = ${authorId}`, (err, resGet) => {
                if (err) {
                    connection.release();
                    return result(err, null, 500);
                } else {
                    if (resGet.length === 0) { // The book is not found for the givent id
                        result({ error: 'Record not found' }, null, 404);
                        connection.release();
                    } else {
                        // Use one connection to DB for the 2 queries
                        connection.query(`DELETE FROM author WHERE id = ${authorId}`, (errDel, resDel) => {
                            connection.release();
                            if (errDel) {
                                result(errDel, null, 500);
                            } else {
                                result(null, resGet, 200);
                                cache.del(`author${authorId}`);
                            }
                        });
                    }
                }
            });
        }
    });
};



module.exports = Author;