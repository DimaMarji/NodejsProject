const User = require("../models/users");
const jwt = require("jsonwebtoken");
const secretKey = require("../shared/secretKey");

const authenticate = (req, res, next) => {
  if (isAllowedRoute(req)) {
    return next();
  }

  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, secretKey, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        requestVerifiesRules(
          req,
          authData.user.roleId,
          (err, rulesAreVerified) => {
            if (err) {
              res.status(403).send("Error while verifying rules"); // Forbidden
            } else {
              if (rulesAreVerified) {
                req.userId=authData.user.id;
                next();
              } else {
                res.sendStatus(403); // Forbidden
              }
            }
          }
        );
      }
    });
  } else {
    res.status(403).send("Invalid authorization header"); // Forbidden
  }
};

function isAllowedRoute(req) {
  // Allowed Routes:
  return ["/api/users/register", "/api/users/login"].indexOf(req.path) >= 0;
}

function isAdminRoutes(req) {
  // Admin Routes:
  return ["/api/books/addAuthor", "/api/books/add","/api/users/"].indexOf(req.path) >= 0;
}

requestVerifiesRules = (req, roleId, result) => {
    // Admin Only
  if (isAdminRoutes(req)) {
    if (roleId == 1) {
      result(null, true);
    } else {
      result(null, false);
    }
  }
  // Allowed for all authenticated users:
  else {
    result(null, true);
  }
};

module.exports = authenticate;
