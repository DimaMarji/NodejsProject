const pool = require('./pool');
const Auths = require('./author');
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 120, checkperiod: 600 });

class Book {
    constructor(book) {
        this.id = book.id;
        this.title = book.title;
        this.authorId = book.authorId;
        this.ISBN = book.ISBN;
        this.image = book.image;
    }
}

Book.getAllBook = (result) => {
    pool.query('SELECT b.id,title,ISBN,image,name as author FROM book b INNER JOIN author a on b.authorid=a.id', (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};


Book.getByPage = (pageId, result) => {
    cacheValue = cache.get(`page${pageId}`);
    if (cacheValue == undefined) {
        pool.query(`SELECT title,ISBN,image,name FROM book b INNER JOIN auther a on b.authorid=a.id limit=10 offset= 10*(${pageId}-1)`, pageId, (err, res) => {
            if (err) {
                result(err, null);
            } else {
                if (res.length === 0) { // The book is not found for the givent id
                    result(null, {});
                } else {
                    cache.set(`page${pageId}`, res);
                    result(null, res);
                }
            }
        });
    } else {
        result(null, cacheValue);
    }
};
Book.getById = (bookId, result) => {
    cacheValue = cache.get(`book${bookId}`);
    if (cacheValue == undefined) {
        pool.query('SELECT title,ISBN,image,a.name as author FROM book b INNER JOIN author a on b.authorid=a.id WHERE b.id = ?', bookId, (err, res) => {
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
            console.log(bookId)
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

Book.addBookToFav =(newfavbook,result)=>{

    pool.query("INSERT INTO userbooksfav (userId ,bookId ) VALUES ( ?,?)", [newfavbook.userId, newfavbook.bookId], 
    (err, res) => {
            if (err) {
                console.log("error", err);
                result(err, null, 500);
            } else {
                console.log(res)
                result(null, { "id": res.insertId, "userId": newfavbook.userId, "bookId": newfavbook.bookId, "favOrder": newfavbook.favOrder });
    
    
            }
        });
}


Book.deleteBookFromFav = (userId,bookId, result) => {
    pool.getConnection((err, connection) => {
        if (err) {
            result(err, null, 500);
        } else {
            connection.query(`SELECT * FROM userbooksfav WHERE bookId = ${bookId}`, (err, resGet) => {
                if (err) {
                    connection.release();
                    return result(err, null, 500);
                } else {
                    if (resGet.length === 0) { // The book is not found for the givent id
                        result({ error: 'Record not found' }, null, 404);
                        connection.release();
                    } else {
                        // Use one connection to DB for the 2 queries
                        connection.query(`DELETE FROM userbooksfav WHERE bookId = ${bookId} and userId = ${userId}`, (errDel, resDel) => {
                            connection.release();
                            if (errDel) {
                                result(errDel, null, 500);
                            } else {
                                result(null, resGet, 200);
                                cache.del(`favbook${bookId}`);
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
            connection.query(`SELECT favOrder FROM userbooksfav 
            WHERE userId = ${userId} and bookId =  ${bookId}`, (err, res) => {
        if (err) {
            connection.release();
            result(err, null, 500);
        } else {
            oldFav = res[0].favOrder;
            console.log(oldFav);
            console.log(newFavOrder);
            if (oldFav>newFavOrder){
                connection.query(`UPDATE userbooksfav SET favOrder = favOrder+1 
                WHERE favOrder BETWEEN ${newFavOrder} and ${oldFav}-1`, (err, res) => {
                    if (err) {
                        result(err, null, 500);
                    } else {
                        connection.query(`UPDATE userbooksfav SET favOrder =  ${newFavOrder} 
                        WHERE userId = ${userId} and bookId =  ${bookId}`, (err, res) => {
                            connection.release();
                            if (err) {
                                result(err, null, 500);
                            } else {
                                result(null, true, 204);
                            }
                        });
                    }
                });}else if(oldFav<newFavOrder){
                        connection.query(`UPDATE userbooksfav SET favOrder = favOrder-1 
                        WHERE favOrder BETWEEN ${oldFav}+1 and ${newFavOrder}`, (err, res) => {
                            if (err) {
                                result(err, null, 500);
                            } else {
                                connection.query(`UPDATE userbooksfav SET favOrder =  ${newFavOrder} 
                                WHERE userId = ${userId} and bookId =  ${bookId}`, (err, res) => {
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
