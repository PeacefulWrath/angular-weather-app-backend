const UserModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


exports.signUp = async (req, res) => {
  try {
    let userModel = new UserModel();

    const userData = await UserModel.find({ email: req.body.email });

    if (userData.length !== 0) {
      throw new Error("user already registered")
    }

    userModel.name = req.body.name
    userModel.email = req.body.email
    userModel.city = req.body.city
    const password = req.body.password

    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) reject(err)
        resolve(hash)
      });
    })
    // console.log("999",hashedPassword)
    userModel.password = hashedPassword


    // console.log("up ummm",userModel)
    const insertedData = await userModel.save()
    // console.log("up inn",insertedData)
   
    if (insertedData) {
      delete insertedData.password
      return res.send({ success: "yes", insertedData })
    } else {
      throw new Error("user not registered")
    }
  } catch (error) {
    return res.status(400).send({ success: "no", message: error.message });
  }
};


exports.signIn = async (req, res) => {
  try {
  
    if (!req.body.email) {
      throw "Please provide email"

    }
    if (!req.body.password) {
      throw "Please provide password"
    }


    const email = req.body.email;
    const password = req.body.password;

    console.log("hhh",req.body)

    const userData = await UserModel.find({ email: email });

    console.log("000",userData[0])
    if (userData.length !== 0) {
      const hash = userData[0]?.password
      const isValidPassword = await bcrypt.compare(password, hash)
      console.log("78",isValidPassword)
      if (isValidPassword) {
        const user = userData[0]


        jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET_KEY, { expiresIn: '1h' }, (error, token) => {
          if (error) {

            throw error.message

          }
          else {
            res.status(201).send({
              success: "yes",
              message: "user successfully sign in",
              token,
              user
            });
          }
        })
      }
      else {
        throw "Password not matched"
      }
    }
    else {
      throw "user not registered"
    }
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
      res.status(201).send({
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