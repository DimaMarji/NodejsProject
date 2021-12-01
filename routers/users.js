const Users = require('../models/user');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const express = require('express');
const secretKey = require('../shared/secretKey');
const app = express();
const router = express.Router();

router.get('/', (req, res) => {
    Users.getAll((err, users) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(users);
        }
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    if (isNaN(id)) // isNaN (is Not a Number) is a function that verifies whether a given string is a normal number
        return res.status(400).send('id should be a number!');

    Users.getById(id, (err, user) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            if (Object.keys(user).length === 0) { // here user = {}
                res.status(404).json(user);
            } else {
                res.status(200).json(user);
            }
        }
    });
});

router.post('/Register', (req, res) => {
    const user = {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        roleId: req.body.roleId
    };

    const { error } = ValidateModel(user);
    if (error) {
        return res.status(400).send({ error: error });
    }

    Users.register(user, (err, user) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                res.status(201).json(user);
            }
    });
});

router.post('/Login', (req, res) => {
        const userName= req.body.userName;
        const password= req.body.password;
    

    const { error } = ValidateLogin({userName, password});
    if (error) {
        return res.status(400).send({ error: error });
    }

    Users.login(userName, password, (err, user) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            jwt.sign({ user }, secretKey, { expiresIn: '1d' }, (err, token) => {
                res.status(201).json(token);
            });
        }
    });
});

router.put('/:id', (req, res) => {
    const user = { name: req.body.name };
    const userId = req.params.id;

    if (isNaN(userId)) { // isNaN (is Not a Number) is a function that verifies whether a given string is a normal number
        return res.status(400).send('id should be a number!');
    }
    const { error } = ValidateModel(user);
    if (error) {
        return res.status(400).send({ error: error });
    }

    Users.updateUser(userId, user, (err, user) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(user);
        }
    });
});

router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    if (isNaN(userId)) // isNaN (is Not a Number) is a function that verifies whether a given string is a normal number
        return res.status(400).send('id should be a number!');

    Users.deleteUser(userId, (err, user, code) => {
        if (err) {
            res.status(code).json({ error: err });
        } else {
            res.status(200).json(user);
        }
    });
});

function ValidateModel(data) {
    const schema = Joi.object({
        userName: Joi.string().max(50).required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
    });

    return schema.validate(data);
}

function ValidateLogin(data) {
    const schema = Joi.object({
        userName: Joi.required(),
        password: Joi.required(),
        
    });

    return schema.validate(data);
}

module.exports = router;
