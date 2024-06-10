const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { elasticClient } = require('../config/elastic-db');


exports.signUp = async (req, res) => {
  try {

    // console.log("eee",req.body.email)
    const userData = await elasticClient.search({
      index: "users",
      query:{ match_phrase:{email:req.body.email}}
    });

    // return res.send(userData)

    if (userData.hits.hits.length !== 0) {
      throw new Error("user already registered")
    }

    const password = req.body.password

    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) reject(err)
        resolve(hash)
      });
    })
    // console.log("999",hashedPassword)


    // console.log("up ummm",userModel)
    const insertedData = await elasticClient.index({
      index: "users",
      document: {
        name: req.body.name,
        city: req.body.city,
        email: req.body.email,
        password: hashedPassword,
      },
    });
    
    // res.send(insertedData)
    // console.log("up inn", insertedData)

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
    // console.log("body",req.body)
  
    if (!req.body.email) {
      throw "Please provide email"

    }
    if (!req.body.password) {
      throw "Please provide password"
    }


    const email = req.body.email;
    const password = req.body.password;

    // console.log("hhh",req.body)

    const userData = await elasticClient.search({
      index: "users",
      query:{ match_phrase:{"email":email}}
    });

    // console.log("000",userData.hits.hits)
    if (userData.hits.hits.length !== 0) {
      const hash = userData.hits.hits[0]._source?.password
      const isValidPassword = await bcrypt.compare(password, hash)
      // console.log("78",isValidPassword)
      if (isValidPassword) {
        const user = userData.hits.hits[0]._source


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