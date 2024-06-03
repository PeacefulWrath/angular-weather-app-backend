const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken")


exports.signIn = async (req, res) => {
  try {
    if (!req.body.email) {
      throw "Please provide email"

    }
    if (!req.body.name) {
      throw "Please provide name"

    }
    if (!req.body.city) {
      throw "Please provide city"

    }


    const userEmail = req.body.email;
    const userName = req.body.name;
    const userCity = req.body.city;

    const userData = {
      name: userName,
      email: userEmail,
      city:userCity
    }

    jwt.sign(JSON.parse(JSON.stringify(userData)), process.env.JWT_SECRET_KEY, { expiresIn: '1h' }, (error, token) => {
      if (error) {

        throw error.message

      }
      else {
        res.status(201).send({
          success: "yes",
          message: "user successfully sign in",
          token
        });
      }
    })

  } catch (error) {
    res.status(500).send({
      success: "no",
      message: error,
    });
  }
};

exports.getToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ")
    const token = bearer[1]
    req.token = token
    next()
  } else {
    res.status(500).send({
      success: "no",
      message: "can't get token",
    })
  }
}

exports.verifyToken = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
    if (err) {
      res.status(500).send({
        success: "no",
        message: err.message,
      })
    } else {
      req.body.authData = authData;
      next()
    }
  })
}

exports.verifyTokenWithoutNext = (req, res) => {
  jwt.verify(req.body.jwt_token, process.env.JWT_SECRET_KEY, (err, userAuthData) => {
    if (err) {
      res.status(301).send({
        success: "no",
        message: err.message,
        userAuthData
      })
    } else {
      res.status(200).send({
        success: "yes",
        message: "token verified",
        userAuthData
      })
    }
  })
}