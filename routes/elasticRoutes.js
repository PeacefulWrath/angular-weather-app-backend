const express = require("express");
const { signUp,signIn,verifyTokenWithoutNext } = require("../controllers/elasticController");

const router = express.Router();

router.post("/register",signUp);
router.post("/login", signIn);
router.post("/verify-token", verifyTokenWithoutNext);

module.exports = router;