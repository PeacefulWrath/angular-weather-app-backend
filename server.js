const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { signIn, verifyTokenWithoutNext } = require("./controllers/userController");


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

app.post("/login",signIn)
app.post("/verify-token",verifyTokenWithoutNext)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
