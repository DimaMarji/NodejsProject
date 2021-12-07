const Book = require("../models/books");
const secretKey = require("../shared/secretKey");
const Joi = require("joi");
const express = require("express");
const app = express();
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get('/', (req, res) => {
    Book.getAllBook((err, books) => {
        if(err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(books);
        }
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    if (isNaN(id)) // isNaN (is Not a Number) is a function that verifies whether a given string is a normal number
        return res.status(400).send('id should be a number!');

    Book.getById(id, (err, book) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            if (Object.keys(book).length === 0) { // here book = {}
                res.status(404).json(book);
            } else {
                res.status(200).json(book);
            }
        }
    });
});

router.get('/:title', (req, res) => {
    const title = req.params.title;
    Book.getBookByTitle(title, (err, book) => {
        if(book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: 'No valid entry found' });
        }
    });
});
router.post('/', (req, res) => {
    let image;
    let uploadPath;
    if(!req.files || Object.keys(req.files).length===0){
      return res.status(400).json('no image were uploaded');
    }
    image=req.files.image;
    uploadPath=__dirname+'/uploads/'+image.name
    console.log(image);
    image.mv(uploadPath,function(err){
      if(err)
        {return res.status(500).json(err);}
        console.log('uploaded')
    const book={
     title: req.body.title,
     ISBN: req.body.ISBN,
     authorId:req.body.authorId,
     image :image.name}

    Book.createBook(book, (err, book) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
          //   const payload= json.stringify({title:`A new book is add${book.title}`});
            res.status(201).json(book);

        }
    });
});
});

router.put('/:id', (req, res) => {
    const book = { title: req.body.title,
        ISBN: req.body.ISBN,
        authorId:req.body.authorId };
    const bookId = req.params.id;

    if (isNaN(bookId)) { // isNaN (is Not a Number) is a function that verifies whether a given string is a normal number
        return res.status(400).send('id should be a number!');
    }
    const { error } = ValidateModel(book);
    if (error) {
        return res.status(400).send({ error: error });
    }

    Book.updateBook(bookId, book, (err, book) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(book);
        }
    });
});

router.delete('/:id', (req, res) => {
    const bookId = req.params.id;
    if (isNaN(bookId)) // isNaN (is Not a Number) is a function that verifies whether a given string is a normal number
        return res.status(400).send('id should be a number!');

    Book.deleteBook(bookId, (err, book, code) => {
        if (err) {
            res.status(code).json({ error: err });
        } else {
            res.status(200).json(book);
        }
    });
});

router.delete('/favourite/:id', (req, res) => {
    const bookId = req.params.id;
    if (isNaN(bookId)) // isNaN (is Not a Number) is a function that verifies whether a given string is a normal number
        return res.status(400).send('id should be a number!');

    Book.deleteBook(bookId, (err, book, code) => {
        if (err) {
            res.status(code).json({ error: err });
        } else {
            res.status(200).json(book);
        }
    });
});

router.put("/:id/isRead", (req, res) => {
  console.log(req.userId)
        const userId = req.userId;;
        const bookId = req.params.id;

        Book.updateReadStatus(userId, bookId, (err, status, code) => {
          if (err) {
            res.status(code).json({ error: err });
          } else {
            res.status(200).json("Read status has changed successfully");
          }
        });
      
    });


router.put("/:id/reorder", (req, res) => {
  console.log(req.userId)
        const userId = req.userId;
        const newFavOrder = req.body.newFavOrder;
        const bookId = req.params.id;

        Book.reorder(newFavOrder, bookId,userId, (err, order, code) => {
          if (err) {
            res.status(code).json({ error: err });
          } else {
            res.status(200).json({ order });
          }
        });
    });
 

      

function ValidateModel(data) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
  });

  return schema.validate(data);
}

module.exports = router;
