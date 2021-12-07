const pool = require('./pool');
var Book = (book) => {
    this.id = book.id;
    this.title = book.title;
    this.ISBN = book.ISBN;
    this.authorId = book.authorId;
   
};

Book.getAllBook = (result) => {
    pool.query('SELECT * FROM book ORDER BY id ', (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

Book.getById = (bookId, result) => {
    cacheValue = cache.get(`book${bookId}`);
    if (cacheValue == undefined) {
        pool.query('SELECT * FROM book WHERE id = ?', bookId, (err, res) => {
            if (err) {
                result(err, null);
            } else {
                if (res.length === 0) { // The book is not found for the givent id
                    result(null, {});
                } else {
                    cache.set(`book${bookId}`, res);
                    result(null, res);
                }
            }
        });
    } else {
        result(null, cacheValue);
    }
};

Book.getByTitle = (booktitle, result) => {
    cacheValue = cache.get(`book${booktitle}`);
    if (cacheValue == undefined) {
        pool.query('SELECT * FROM book WHERE title = ?', booktitle, (err, res) => {
            if (err) {
                result(err, null);
            } else {
                if (res.length === 0) { // The user is not found for the givent id
                    result(null, {});
                } else {
                    cache.set(`book${booktitle}`, res);
                    result(null, res);
                }
            }
        });
    } else {
        result(null, cacheValue);
    }
};

Book.createBook = (newBook, result) => {
    pool.query("INSERT INTO book (title ,authorId,ISBN,image ) VALUES ( ?,?,?,? )", [newBook.title, newBook.authorId,
    newBook.ISBN, newBook.image], (err, res) => {
        if (err) {
            console.log("error", err);
            result(err, null, 500);
        } else {
            console.log(res)
            result(null, { "id": res.insertId, "title": newBook.title, "authorId": newBook.authorId, "ISBN": newBook.ISBN, "image": newBook.image });


        }
    });

};

Book.deleteBook = (bookId, result) => {
    pool.getConnection((err, connection) => {
        if (err) {
            result(err, null, 500);
        } else {
            connection.query(`SELECT * FROM book WHERE id = ${bookId}`, (err, resGet) => {
                if (err) {
                    connection.release();
                    return result(err, null, 500);
                } else {
                    if (resGet.length === 0) { // The book is not found for the givent id
                        result({ error: 'Record not found' }, null, 404);
                        connection.release();
                    } else {
                        // Use one connection to DB for the 2 queries
                        connection.query(`DELETE FROM book WHERE id = ${bookId}`, (errDel, resDel) => {
                            connection.release();
                            if (errDel) {
                                result(errDel, null, 500);
                            } else {
                                result(null, resGet, 200);
                                cache.del(`book${bookId}`);
                            }
                        });
                    }
                }
            });
        }
    });
};


Book.updateReadStatus = (userId,bookId,result) => {
    pool.query(`UPDATE userbooksfav
                SET isRead = !isRead
                WHERE userId = ${userId} and bookId =  ${bookId}`, (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};
Book.reorder=(newFavOrder,bookId,userId,result) => {
    pool.getConnection((err, connection) => {
        if (err) {
            result(err, null);
        } else {
            connection.query(`SELECT favOrder FROM userbooksfav WHERE userId = ${userId} and bookId =  ${bookId}`, (err, res) => {
        if (err) {
            connection.release();
            result(err, null, 500);
        } else {
            oldFav = res[0].favOrder;
            console.log(oldFav);
            console.log(newFavOrder);
            if (oldFav>newFavOrder){
                connection.query(`UPDATE userbooksfav SET favOrder = favOrder+1 WHERE favOrder BETWEEN ${newFavOrder} and ${oldFav}-1`, (err, res) => {
                    if (err) {
                        result(err, null, 500);
                    } else {
                        connection.query(`UPDATE userbooksfav SET favOrder =  ${newFavOrder} WHERE userId = ${userId} and bookId =  ${bookId}`, (err, res) => {
                            connection.release();
                            if (err) {
                                result(err, null, 500);
                            } else {
                                result(null, true, 204);
                            }
                        });
                    }
                });}else if(oldFav<newFavOrder){
                        connection.query(`UPDATE userbooksfav SET favOrder = favOrder-1 WHERE favOrder BETWEEN ${oldFav}+1 and ${newFavOrder}`, (err, res) => {
                            if (err) {
                                result(err, null, 500);
                            } else {
                                connection.query(`UPDATE userbooksfav SET favOrder =  ${newFavOrder} WHERE userId = ${userId} and bookId =  ${bookId}`, (err, res) => {
                                    connection.release();
                                    if (err) {
                                        result(err, null, 500);
                                    } else {
                                        result(null, true, 204);
                                    }
                                });
                            }
                        });}else{
                            result(null, "No thing has changed,already in this order", 204);
                        }
                }
               
            
        });
        }
    });

    };

module.exports = Book;
