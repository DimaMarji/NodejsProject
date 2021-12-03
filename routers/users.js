const User = require("../models/users");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const express = require("express");
const secretKey = require("../shared/secretKey");
const app = express();
const router = express.Router();

//Get all users
router.get("/", (req, res) => {
  User.getAll((err, users) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json(users);
    }
  });
});
// Get user by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  if (isNaN(id))
    // isNaN (is Not a Number) is a function that verifies whether a given string is a normal number
    return res.status(400).send("id should be a number!");

  User.getById(id, (err, user) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      if (Object.keys(user).length === 0) {
        // here user = {}
        res.status(404).json(user);
      } else {
        res.status(200).json(user);
      }
    }
  });
});

router.post("/register", (req, res) => {
  const user = {
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    roleId: req.body.roleId,
  };

  const { error } = ValidateModel(user);
  if (error) {
    return res.status(400).send({ error: error });
  }

  User.register(user, (err, user) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(201).json(user);
    }
  });
});

router.post("/login", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  const { error } = ValidateLogin({ userName, password });
  if (error) {
    console.log(error);
    return res.status(400).send({ error: error });
  }

  User.login(userName, password, (err, user) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      jwt.sign({ user }, secretKey, { expiresIn: "1d" }, (err, token) => {
        res
          .status(201)
          .json({ token: token, userName: user.userName, email: user.email });
      });
    }
  });
});

//Update user info
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const userName = req.body.userName;
  const password = req.body.password;
  const email = req.body.email;
  const roleId = req.body.roleId;
  if (isNaN(id)) {
    // isNaN (is Not a Number) is a function that verifies whether a given string is a normal number
    return res.status(400).send("id should be a number!");
  }
  User.updateById(id, userName, password, email, roleId, (err, user) => {
    const { error } = ValidateModel(user);
    if (error) {
      return res.status(400).send({ error: error });
    }
    if (err) {
      res.status(500).json({ error: err });
    } else {
      if (Object.keys(user).length === 0) {
        // specs == {}
        res.status(404).json(user);
      } else {
        res.status(200).json(user);
      }
    }
  });
});
router.get("/:id/fav", (req, res) => { 
    const bearerHeader = req.headers["authorization"]; 
    if (typeof bearerHeader !== "undefined") { 
      const bearer = bearerHeader.split(" "); 
      const bearerToken = bearer[1]; 
      jwt.verify(bearerToken, secretKey, (err, authData) => { 
        if (err) { 
          res.sendStatus(403); 
        } else { 
          const userId = authData.user.id; 
          
   
          Book.favBook(userId, (err, status, code) => { 
            if (err) { 
              res.status(code).json({ error: err }); 
            } else { 
              res.status(200).json({ status: status }); 
            } 
          }); 
        } 
      }); 
    } else { 
      res.status(403).send("Invalid authorization header"); // Forbidden 
    } 
  });
router.delete("/:id", (req, res) => {
  const userId = req.params.id;
  if (isNaN(userId))
    // isNaN (is Not a Number) is a function that verifies whether a given string is a normal number
    return res.status(400).send("id should be a number!");

  User.deleteUser(userId, (err, user, code) => {
    if (err) {
      res.status(code).json({ error: err });
    } else {
      res.status(200).json(user);
    }
  });
});

function ValidateModel(data) {
  const schema = Joi.object({
    userName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    roleId: Joi.required(),
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
