const express = require("express");
const { signIn, signUp, verifyToken, verifyTokenWithoutNext } = require("../controllers/userController");

const router = express.Router();

router.post("/register",signUp);
router.post("/login", signIn);
router.post("/verify-token", verifyTokenWithoutNext);

module.exports = router;