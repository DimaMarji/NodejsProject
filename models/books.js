const pool = require('./pool');
var Book = (book) => {
    this.id = book.id;
    this.title = book.title;
    this.ISBN = book.ISBN;
    this.authorId = book.authorId;
   
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