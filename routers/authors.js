const Auths = require('../models/author');
const Joi = require('joi');
const express = require('express');
const app = express();
const router = express.Router();

router.get('/', (req, res) => {
    Auths.getAll((err, Auths) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(Auths);
        }
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    if (isNaN(id)) // isNaN (is Not a Number) is a function that verifies whether a given string is a normal number
        return res.status(400).send('id should be a number!');

        Auths.getById(id, (err, author) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            if (Object.keys(spec).length === 0) { // here spec = {}
                res.status(404).json(author);
            } else {
                res.status(200).json(author);
            }
        }
    });
});


router.post('/', (req, res) => {
    const auth = { name: req.body.name };

    const { error } = ValidateModel(auth);
    if (error) {
        return res.status(400).send({ error: error });
    }

    Auths.createAuthor(auth, (err, author) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(201).json(author);
        }
    });
});




router.delete('/:id', (req, res) => {
    const authId = req.params.id;
    if (isNaN(specId)) // isNaN (is Not a Number) is a function that verifies whether a given string is a normal number
        return res.status(400).send('id should be a number!');

    Auths.deleteAuthor(authId, (err, author, code) => {
        if (err) {
            res.status(code).json({ error: err });
        } else {
            res.status(200).json(author);
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